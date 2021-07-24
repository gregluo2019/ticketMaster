export const TIME_FORMAT = 'ddd MMM-DD HH:mm'
export const DATE_FORMAT = 'YYYY-MM-DD'

export const CHECK_IN = 'Check In'
export const CHECK_OUT = 'Check Out'

export const ACTION_COLORS = [
  '#CFD8DC',
  '#78909C',
  '#D1C4E9',
  '#7E57C2',
  '#BBDEFB',
  '#42A5F5',
  '#C8E6C9',
  '#66BB6A',
  '#FFE0B2',
  '#FFA726'
]
export const ACTION_TEXT_COLORS = [
  'black',
  'white',
  'black',
  'white',
  'black',
  'white',
  'black',
  'white',
  'black',
  'white'
];

export const ACTIONS = [
  'Cutting Start',
  "Cutting End",
  'Sanding Start',
  "Sanding End",
  'BaseCoating Start',
  "BaseCoating End",
  'TopCoating Start',
  "TopCoating End",
  'Packing Start',
  "Packing End"
];


export const EDITOR_CONFIG = {
  editable: true,
  spellcheck: true,
  height: '10rem',
  minHeight: '5rem',
  maxHeight: 'auto',
  width: '100%',
  minWidth: '0',
  translate: 'no',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: 'Arial',
  defaultFontSize: '',
  fonts: [],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText',
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
  uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [["fontName"]]
};
export const EDITOR_CONFIG_NO_TOOLBar = {
  editable: true,
  spellcheck: true,
  height: '5rem',
  minHeight: '2rem',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'no',
  enableToolbar: true,
  showToolbar: false,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: 'Arial',
  defaultFontSize: '',
  fonts: [],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText',
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
  uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [["fontName"]]
};
