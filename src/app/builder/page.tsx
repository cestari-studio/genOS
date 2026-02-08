'use client';

import React, { useState, useMemo } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  TextInput,
  Select,
  SelectItem,
  Toggle,
  Search,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  CodeSnippet,
  Tag,
  Accordion,
  AccordionItem,
  Layer,
  ProgressBar,
  Modal,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  InlineNotification,
  TextArea,
  Checkbox,
  RadioButton,
  RadioButtonGroup,
  OverflowMenu,
  OverflowMenuItem,
  ClickableTile,
  ExpandableTile,
  Loading,
  InlineLoading,
} from '@carbon/react';
import {
  Add,
  Copy,
  Download,
  Reset,
  Play,
  Maximize,
  Code,
  FolderOpen,
  Export,
  Close,
} from '@carbon/icons-react';
import './builder.scss';

type ComponentConfig = {
  name: string;
  category: string;
  defaultProps: Record<string, any>;
  configurableProps: Array<{
    name: string;
    type: 'text' | 'select' | 'toggle' | 'number';
    label?: string;
    options?: string[];
  }>;
  render: (props: Record<string, any>) => React.ReactNode;
};

const componentCatalog: ComponentConfig[] = [
  // Layout
  {
    name: 'Tile',
    category: 'Layout',
    defaultProps: { children: 'Tile content here' },
    configurableProps: [
      { name: 'children', type: 'text', label: 'Content' },
    ],
    render: (props) => <Tile>{props.children || 'Tile content here'}</Tile>,
  },
  {
    name: 'ClickableTile',
    category: 'Layout',
    defaultProps: { children: 'Click me', onClick: () => {} },
    configurableProps: [
      { name: 'children', type: 'text', label: 'Content' },
    ],
    render: (props) => (
      <ClickableTile>{props.children || 'Click me'}</ClickableTile>
    ),
  },
  {
    name: 'ExpandableTile',
    category: 'Layout',
    defaultProps: { tileCollapsedIconText: 'Expand', tileExpandedIconText: 'Collapse', children: 'Expandable content' },
    configurableProps: [
      { name: 'children', type: 'text', label: 'Content' },
    ],
    render: (props) => (
      <ExpandableTile tileCollapsedIconText="Expand" tileExpandedIconText="Collapse">{props.children || 'Expandable content'}</ExpandableTile>
    ),
  },

  // Data Display
  {
    name: 'Tag',
    category: 'Data Display',
    defaultProps: { type: 'gray', children: 'Tag Label' },
    configurableProps: [
      { name: 'type', type: 'select', options: ['gray', 'red', 'green', 'blue', 'magenta', 'cyan'] },
      { name: 'children', type: 'text', label: 'Label' },
    ],
    render: (props) => <Tag type={props.type || 'gray'}>{props.children || 'Tag Label'}</Tag>,
  },
  {
    name: 'ProgressBar',
    category: 'Data Display',
    defaultProps: { value: 50, label: 'Progress' },
    configurableProps: [
      { name: 'value', type: 'number', label: 'Value (0-100)' },
      { name: 'label', type: 'text' },
    ],
    render: (props) => <ProgressBar label={props.label || 'Progress'} value={props.value ?? 50} />,
  },
  {
    name: 'Accordion',
    category: 'Data Display',
    defaultProps: {},
    configurableProps: [],
    render: () => (
      <Accordion>
        <AccordionItem title="Section 1">
          <p>Content for section 1</p>
        </AccordionItem>
        <AccordionItem title="Section 2">
          <p>Content for section 2</p>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    name: 'StructuredList',
    category: 'Data Display',
    defaultProps: {},
    configurableProps: [],
    render: () => (
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Column 1</StructuredListCell>
            <StructuredListCell head>Column 2</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          <StructuredListRow>
            <StructuredListCell>Row 1, Cell 1</StructuredListCell>
            <StructuredListCell>Row 1, Cell 2</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Row 2, Cell 1</StructuredListCell>
            <StructuredListCell>Row 2, Cell 2</StructuredListCell>
          </StructuredListRow>
        </StructuredListBody>
      </StructuredListWrapper>
    ),
  },

  // Input
  {
    name: 'TextInput',
    category: 'Input',
    defaultProps: { labelText: 'Input Label', placeholder: 'Enter text...' },
    configurableProps: [
      { name: 'labelText', type: 'text' },
      { name: 'placeholder', type: 'text' },
    ],
    render: (props) => <TextInput id="textinput-preview" labelText={props.labelText || 'Input Label'} placeholder={props.placeholder || ''} />,
  },
  {
    name: 'TextArea',
    category: 'Input',
    defaultProps: { labelText: 'Text Area', placeholder: 'Enter multiple lines...' },
    configurableProps: [
      { name: 'labelText', type: 'text' },
      { name: 'placeholder', type: 'text' },
    ],
    render: (props) => <TextArea labelText={props.labelText || 'Text Area'} placeholder={props.placeholder || ''} />,
  },
  {
    name: 'Select',
    category: 'Input',
    defaultProps: { labelText: 'Select an option' },
    configurableProps: [
      { name: 'labelText', type: 'text' },
    ],
    render: (props) => (
      <Select id="select-preview" labelText={props.labelText || 'Select an option'}>
        <SelectItem value="" text="Choose an option" />
        <SelectItem value="option-1" text="Option 1" />
        <SelectItem value="option-2" text="Option 2" />
        <SelectItem value="option-3" text="Option 3" />
      </Select>
    ),
  },
  {
    name: 'Toggle',
    category: 'Input',
    defaultProps: { id: 'toggle-demo', labelText: 'Toggle' },
    configurableProps: [
      { name: 'labelText', type: 'text' },
    ],
    render: (props) => <Toggle id="toggle-preview" labelText={props.labelText || 'Toggle'} />,
  },
  {
    name: 'Checkbox',
    category: 'Input',
    defaultProps: { id: 'checkbox-demo', labelText: 'Checkbox', defaultChecked: false },
    configurableProps: [
      { name: 'labelText', type: 'text' },
    ],
    render: (props) => <Checkbox id="checkbox-preview" labelText={props.labelText || 'Checkbox'} />,
  },
  {
    name: 'RadioButton',
    category: 'Input',
    defaultProps: {},
    configurableProps: [],
    render: () => (
      <RadioButtonGroup name="radio-group" defaultSelected="option-1">
        <RadioButton value="option-1" id="radio-1" labelText="Option 1" />
        <RadioButton value="option-2" id="radio-2" labelText="Option 2" />
        <RadioButton value="option-3" id="radio-3" labelText="Option 3" />
      </RadioButtonGroup>
    ),
  },

  // Navigation
  {
    name: 'Tabs',
    category: 'Navigation',
    defaultProps: {},
    configurableProps: [],
    render: () => (
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>Content for tab 1</p>
          </TabPanel>
          <TabPanel>
            <p>Content for tab 2</p>
          </TabPanel>
          <TabPanel>
            <p>Content for tab 3</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    ),
  },

  // Actions
  {
    name: 'Button',
    category: 'Actions',
    defaultProps: { kind: 'primary', size: 'lg', children: 'Button' },
    configurableProps: [
      { name: 'kind', type: 'select', options: ['primary', 'secondary', 'tertiary', 'ghost', 'danger'] },
      { name: 'size', type: 'select', options: ['sm', 'md', 'lg', 'xl'] },
      { name: 'children', type: 'text', label: 'Label' },
    ],
    render: (props) => <Button kind={props.kind || 'primary'} size={props.size || 'lg'}>{props.children || 'Button'}</Button>,
  },

  // Feedback
  {
    name: 'InlineNotification',
    category: 'Feedback',
    defaultProps: { kind: 'info', title: 'Notification', subtitle: 'This is a notification' },
    configurableProps: [
      { name: 'kind', type: 'select', options: ['error', 'info', 'info-square', 'success', 'warning', 'warning-alt'] },
      { name: 'title', type: 'text' },
      { name: 'subtitle', type: 'text' },
    ],
    render: (props) => <InlineNotification kind={props.kind || 'info'} title={props.title || 'Notification'} subtitle={props.subtitle || ''} />,
  },
  {
    name: 'Loading',
    category: 'Feedback',
    defaultProps: { active: true, description: 'Loading...' },
    configurableProps: [],
    render: (props) => <Loading active={props.active ?? true} description={props.description || 'Loading...'} />,
  },
];

interface PageComponentItem {
  id: string;
  name: string;
  props: Record<string, any>;
}

export default function PageBuilder() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentConfig | null>(
    componentCatalog[0]
  );
  const [componentProps, setComponentProps] = useState<Record<string, any>>(
    selectedComponent?.defaultProps || {}
  );
  const [pageComponents, setPageComponents] = useState<PageComponentItem[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const filteredCatalog = useMemo(() => {
    return componentCatalog.filter((comp) =>
      comp.name.toLowerCase().includes(catalogSearch.toLowerCase())
    );
  }, [catalogSearch]);

  const categorizedCatalog = useMemo(() => {
    const categories = new Map<string, ComponentConfig[]>();
    filteredCatalog.forEach((comp) => {
      if (!categories.has(comp.category)) {
        categories.set(comp.category, []);
      }
      categories.get(comp.category)!.push(comp);
    });
    return categories;
  }, [filteredCatalog]);

  const handleComponentSelect = (component: ComponentConfig) => {
    setSelectedComponent(component);
    setComponentProps({ ...component.defaultProps });
  };

  const handlePropChange = (propName: string, value: any) => {
    setComponentProps((prev) => ({
      ...prev,
      [propName]: value,
    }));
  };

  const handleAddToPage = () => {
    if (selectedComponent) {
      const newComponent: PageComponentItem = {
        id: `component-${Date.now()}`,
        name: selectedComponent.name,
        props: { ...componentProps },
      };
      setPageComponents([...pageComponents, newComponent]);
    }
  };

  const handleRemoveComponent = (id: string) => {
    setPageComponents(pageComponents.filter((comp) => comp.id !== id));
  };

  const handleExportJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      components: pageComponents.map((comp) => ({
        name: comp.name,
        props: comp.props,
      })),
    };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `page-builder-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCodeSnippet = (): string => {
    if (!selectedComponent) return '';

    const propsString = Object.entries(componentProps)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'boolean') {
          return `${key}={${value}}`;
        } else if (typeof value === 'number') {
          return `${key}={${value}}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n  ');

    if (selectedComponent.name === 'Button') {
      return `<Button\n  ${propsString}\n>\n  {props.children}\n</Button>`;
    }
    return `<${selectedComponent.name}\n  ${propsString}\n/>`;
  };

  return (
    <Layer>
      <div className="builder-layout">
        {/* Left Panel - Component Catalog */}
        <div className="builder-catalog">
          <div className="builder-catalog__header">
            <h2 className="builder-catalog__title">Catálogo de Componentes</h2>
          </div>

          <Search
            size="lg"
            labelText="Buscar componente"
            placeholder="Buscar componente..."
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.currentTarget.value)}
            className="builder-catalog__search"
          />

          <div className="builder-catalog__categories">
            {Array.from(categorizedCatalog.entries()).map(([category, components]) => (
              <Accordion key={category} size="sm">
                <AccordionItem title={category}>
                  <div className="builder-catalog__items">
                    {components.map((comp) => (
                      <div
                        key={comp.name}
                        className={`builder-catalog__item ${
                          selectedComponent?.name === comp.name
                            ? 'builder-catalog__item--selected'
                            : ''
                        }`}
                        onClick={() => handleComponentSelect(comp)}
                        role="button"
                        tabIndex={0}
                      >
                        {comp.name}
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>

        {/* Center Panel - Canvas */}
        <div className="builder-canvas">
          {selectedComponent && (
            <div className="builder-canvas__content">
              <div className="builder-canvas__preview-section">
                <h3 className="builder-canvas__preview-title">
                  {selectedComponent.name} - Preview
                </h3>
                <div className="builder-canvas__preview-box">
                  {selectedComponent.render(componentProps)}
                </div>
              </div>

              <div className="builder-canvas__code-section">
                <h3 className="builder-canvas__code-title">JSX Code</h3>
                <CodeSnippet type="single" feedback="Copied!">
                  {getCodeSnippet()}
                </CodeSnippet>
              </div>

              <div className="builder-canvas__actions">
                <Button
                  kind="primary"
                  size="lg"
                  onClick={handleAddToPage}
                  renderIcon={Add}
                >
                  Adicionar à Página
                </Button>
                <Button
                  kind="secondary"
                  size="lg"
                  onClick={() => setComponentProps({ ...selectedComponent.defaultProps })}
                  renderIcon={Reset}
                >
                  Resetar
                </Button>
              </div>
            </div>
          )}

          {!selectedComponent && (
            <div className="builder-canvas__empty">
              <p>Selecione um componente do catálogo para começar</p>
            </div>
          )}
        </div>

        {/* Right Panel - Properties */}
        <div className="builder-properties">
          <div className="builder-properties__header">
            <h3 className="builder-properties__title">Propriedades</h3>
          </div>

          {selectedComponent ? (
            <div className="builder-properties__controls">
              {selectedComponent.configurableProps.map((prop) => (
                <div key={prop.name} className="builder-properties__control-group">
                  <label className="builder-properties__label">
                    {prop.label || prop.name}
                  </label>

                  {prop.type === 'text' && (
                    <TextInput
                      id={`prop-text-${prop.name}`}
                      labelText=""
                      hideLabel
                      value={componentProps[prop.name] || ''}
                      onChange={(e) => handlePropChange(prop.name, e.currentTarget.value)}
                      size="sm"
                    />
                  )}

                  {prop.type === 'number' && (
                    <TextInput
                      id={`prop-num-${prop.name}`}
                      labelText=""
                      hideLabel
                      type="number"
                      value={componentProps[prop.name] || 0}
                      onChange={(e) => handlePropChange(prop.name, parseInt(e.currentTarget.value))}
                      size="sm"
                    />
                  )}

                  {prop.type === 'select' && (
                    <Select
                      id={`prop-select-${prop.name}`}
                      labelText=""
                      hideLabel
                      value={componentProps[prop.name] || ''}
                      onChange={(e) => handlePropChange(prop.name, e.currentTarget.value)}
                      size="sm"
                    >
                      {prop.options?.map((opt) => (
                        <SelectItem key={opt} value={opt} text={opt} />
                      ))}
                    </Select>
                  )}

                  {prop.type === 'toggle' && (
                    <Toggle
                      id={`toggle-${prop.name}`}
                      labelText=""
                      hideLabel
                      toggled={componentProps[prop.name] || false}
                      onChange={(val) => handlePropChange(prop.name, val)}
                      size="sm"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="builder-properties__empty">
              <p>Selecione um componente</p>
            </div>
          )}

          <div className="builder-properties__page-section">
            <h4 className="builder-properties__page-title">Página ({pageComponents.length})</h4>
            <div className="builder-properties__page-list">
              {pageComponents.length === 0 ? (
                <p className="builder-properties__empty-text">Nenhum componente adicionado</p>
              ) : (
                pageComponents.map((comp) => (
                  <div key={comp.id} className="builder-properties__page-item">
                    <span>{comp.name}</span>
                    <Button
                      hasIconOnly
                      kind="ghost"
                      size="sm"
                      onClick={() => handleRemoveComponent(comp.id)}
                      renderIcon={Close}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="builder-properties__footer">
            <Button
              kind="primary"
              size="md"
              onClick={() => setPreviewMode(!previewMode)}
              renderIcon={Maximize}
              className="builder-btn--full-width"
            >
              {previewMode ? 'Ocultar' : 'Preview'}
            </Button>
            <Button
              kind="secondary"
              size="md"
              onClick={handleExportJSON}
              renderIcon={Export}
              className="builder-btn--full-width"
            >
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      {previewMode && (
        <Modal
          modalHeading="Page Preview"
          open={previewMode}
          onRequestClose={() => setPreviewMode(false)}
          size="lg"
        >
          <div className="builder-modal__preview">
            {pageComponents.length === 0 ? (
              <p>Nenhum componente para visualizar</p>
            ) : (
              <div className="builder-modal__components">
                {pageComponents.map((comp) => {
                  const compConfig = componentCatalog.find((c) => c.name === comp.name);
                  return (
                    <div key={comp.id} className="builder-modal__component">
                      <Tag type="blue" className="builder-modal__component-tag">
                        {comp.name}
                      </Tag>
                      <div className="builder-modal__component-preview">
                        {compConfig?.render(comp.props)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Modal>
      )}
    </Layer>
  );
}
