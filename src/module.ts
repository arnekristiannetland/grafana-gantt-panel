import { Field, FieldType, PanelPlugin } from '@grafana/data';
import { FieldSelectEditor } from 'grafana-plugin-support';
import { GanttPanel } from './components/GanttPanel';
import { ColorEditor } from './components/ColorEditor';
import { GanttOptions } from './types';

export const plugin = new PanelPlugin<GanttOptions>(GanttPanel).setPanelOptions((builder) => {
  return builder
    .addBooleanSwitch({
      path: 'experiments.enabled',
      name: 'Enable experiments',
      description: `Try out new features that we're working on. Be aware that experiments can be unstable and may break your panel. Use at your own risk.`,
      category: ['Experiments'],
    })
    .addBooleanSwitch({
      path: 'experiments.lockToExtents',
      name: 'Lock to extents',
      description: 'Locks the view to the oldest start time and the most recent end time. This disables zooming.',
      category: ['Experiments'],
      showIf: (options) => options.experiments && options.experiments.enabled,
    })
    .addBooleanSwitch({
      path: 'experiments.relativeXAxis',
      name: 'Relative time',
      description: 'Displays the duration since the start of the first task.',
      category: ['Experiments'],
      showIf: (options) => options.experiments && options.experiments.enabled,
    })
    .addFieldNamePicker({
      path: 'sizeByField',
      name: 'Size by',
      description: 'Field to use for size. Defaults to the first numeric field.',
      category: ['Dimensions'],
      settings: {
        filter: (f: Field) => f.type === FieldType.number,
      },
    })
    .addCustomEditor({
      id: 'textField',
      path: 'textField',
      name: 'Text',
      description: 'Field to use for the text. Must be unique. Defaults to the first textual field.',
      editor: FieldSelectEditor,
      category: ['Dimensions'],
      settings: {
        filterByType: [FieldType.string],
      },
    })
    .addCustomEditor({
      id: 'startField',
      path: 'startField',
      name: 'Start time',
      description: 'Field to use for the start time. Defaults to the first time field.',
      editor: FieldSelectEditor,
      category: ['Dimensions'],
      settings: {
        filterByType: [FieldType.time, FieldType.string, FieldType.number],
      },
    })
    .addCustomEditor({
      id: 'endField',
      path: 'endField',
      name: 'End time',
      description: 'Field to use for the end time. Defaults to the second time field.',
      editor: FieldSelectEditor,
      category: ['Dimensions'],
      settings: {
        filterByType: [FieldType.time, FieldType.string, FieldType.number],
      },
    })
    .addCustomEditor({
      id: 'colorByField',
      path: 'colorByField',
      name: 'Color by',
      description: 'Field to use for colors. Defaults to the text field.',
      editor: FieldSelectEditor,
      category: ['Dimensions'],
      settings: {
        filterByType: [FieldType.string, FieldType.number],
      },
    })
    .addCustomEditor({
      id: 'groupByField',
      path: 'groupByField',
      name: 'Group by',
      description: 'Field to use for grouping.',
      editor: FieldSelectEditor,
      category: ['Dimensions'],
      settings: {
        filterByType: [FieldType.string],
      },
    })
    .addCustomEditor({
      id: 'labelFields',
      path: 'labelFields',
      name: 'Labels',
      description: 'Fields to use as labels in the tooltip.',
      category: ['Dimensions'],
      editor: FieldSelectEditor,
      settings: {
        multi: true,
      },
    })
    .addBooleanSwitch({
      path: 'showYAxis',
      name: 'Show Y-axis',
      defaultValue: true,
    })
    .addSelect({
      path: 'sortBy',
      name: 'Sort by',
      defaultValue: 'startTime',
      settings: {
        options: [
          {
            label: 'Text',
            value: 'text',
            description: 'Sort tasks alphabetically by their text',
          },
          {
            label: 'Start time',
            value: 'startTime',
            description: 'Sort tasks chronologically by their start time',
          },
        ],
      },
    })
    .addSelect({
      path: 'sortOrder',
      name: 'Sort order',
      defaultValue: 'asc',
      settings: {
        options: [
          {
            label: 'Ascending',
            value: 'asc',
            description: 'A-Z if sorting by text, or oldest to most recent if sorting by time',
          },
          {
            label: 'Descending',
            value: 'desc',
            description: 'Z-A if sorting by text, or most recent to oldest if sorting by time',
          },
        ],
      },
    })
    .addCustomEditor({
      id: 'colors',
      path: 'colors',
      name: 'Color mappings',
      editor: ColorEditor,
      showIf: (options, data) => {
        // This function duplicates the logic in GanttPanel to figure out
        // whether the Color by dimension is a string.

        if (!data || !data.length) {
          return false;
        }

        const frame = data[0];

        const textField = options.textField
          ? frame.fields.find((f) => f.name === options.textField)
          : frame.fields.find((f) => f.type === FieldType.string);

        const colorByField = options.colorByField
          ? frame.fields.find((f) => f.name === options.colorByField)
          : textField;

        if (!colorByField) {
          return false;
        }

        return colorByField.type === FieldType.string;
      },
    });
});
