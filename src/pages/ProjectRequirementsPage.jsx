import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus, Trash2, Pencil, Layers3, Check, PackageSearch, CopyPlus,
  PackagePlus, ShoppingBasket, ArrowRight, X,
} from 'lucide-react';
import { api, cash, readError } from '../lib/api';
import { useApp } from '../lib/ctx';
import { Btn, Head, Panel, Pill, Notice, Table, SelectInput, TextInput, Empty, useLoad } from '../components/UI';
import './projectRequirements.css';

let sequence = 0;
const createRow = () => ({
  key: `material-${++sequence}`,
  mode: 'catalog', productId: '', variantId: '',
  manualProductName: '', manualVariantName: '', saveToCatalog: false,
  description: '', quantity: '1', unit: 'Nos', estimatedRate: '', notes: '',
});
const toEntry = item => ({
  ...createRow(),
  mode: item.productId ? 'catalog' : 'manual',
  productId: item.productId || '', variantId: item.variantId || '',
  manualProductName: item.manualProductName || (!item.productId ? item.description : ''),
  manualVariantName: item.manualVariantName || '',
  description: item.description || '', quantity: item.quantity ?? 1,
  unit: item.unit || 'Nos', estimatedRate: item.estimatedRate ?? '',
  notes: item.notes || '',
});
const labelFor = (xs, id) => xs.find(x => Number(x.id) === Number(id))?.name || '';
const normalize = item => ({
  mode: item.mode,
  productId: item.mode === 'catalog' ? item.productId : null,
  variantId: item.mode === 'catalog' ? (item.variantId || null) : null,
  manualProductName: item.mode === 'manual' ? item.manualProductName.trim() : null,
  manualVariantName: item.manualVariantName.trim(),
  saveToCatalog: Boolean(item.saveToCatalog),
  description: item.description.trim(), quantity: item.quantity,
  unit: item.unit.trim() || 'Nos', estimatedRate: item.estimatedRate,
  notes: item.notes.trim(),
});

function DecimalField({ label, value, onChange, step = '0.001', min = '0', required = false }) {
  return <label className="field"><span>{label}</span><input
    type="number" min={min} step={step} required={required} value={value}
    onChange={event => onChange(event.target.value)} />
  </label>;
}

function MaterialEditor({ row, number, products, variants, update, remove, duplicate, editable = true }) {
  const selectedProduct = products.find(p => String(p.id) === String(row.productId));
  const availableVariants = variants.filter(v => String(v.productId) === String(row.productId));
  const [productSearch, setProductSearch] = useState('');
  const visibleProducts = products.filter(p =>
    (p.name + ' ' + (p.sku || '') + ' ' + (p.category || '')).toLowerCase().includes(productSearch.toLowerCase()),
  );
  const set = (key, value) => update({ ...row, [key]: value });
  const changeProduct = id => {
    const product = products.find(p => String(p.id) === String(id));
    update({ ...row, productId: id, variantId: '', manualVariantName: '', saveToCatalog: false, unit: product?.unit || 'Nos', description: '' });
  };
  const changeVariant = id => {
    const variant = variants.find(v => String(v.id) === String(id));
    update({ ...row, variantId: id, manualVariantName: '', saveToCatalog: false, unit: variant?.unit || selectedProduct?.unit || 'Nos', description: '' });
  };
  return <div className="req-line-card">
    <div className="req-row-header">
      <div className="req-row-number"><span>{number}</span><b>Required material</b></div>
      {editable && <div className="req-row-actions">
        {duplicate && <button type="button" title="Duplicate this row" onClick={duplicate}><CopyPlus size={16}/> Duplicate</button>}
        {remove && <button type="button" title="Remove row" className="req-danger-link" onClick={remove}><Trash2 size={16}/> Remove</button>}
      </div>}
    </div>
    <div className="req-choice-tabs" role="group" aria-label={`Material ${number} entry method`}>
      <button type="button" className={row.mode === 'catalog' ? 'active' : ''}
        onClick={() => update({ ...row, mode: 'catalog', productId: '', variantId: '', manualVariantName: '', saveToCatalog: false, description: '' })}>
        <PackageSearch size={17}/> Choose from catalog
      </button>
      <button type="button" className={row.mode === 'manual' ? 'active' : ''}
        onClick={() => update({ ...row, mode: 'manual', manualProductName: row.manualProductName || selectedProduct?.name || '', manualVariantName: row.manualVariantName || labelFor(variants, row.variantId), saveToCatalog: false, description: '' })}>
        <Pencil size={16}/> Type a new material
      </button>
    </div>
    {row.mode === 'catalog' ? <><div className="req-picker-grid">
      <TextInput label="Find product" value={productSearch} onChange={setProductSearch} placeholder="Search by name, code or category" />
      <SelectInput label="Product *" required value={row.productId} onChange={changeProduct}
        options={visibleProducts.map(p => ({ value: p.id, label: `${p.name}${p.sku ? ` · ${p.sku}` : ''}` }))}
        placeholder={products.length ? 'Choose a product' : 'No products yet — type a new material'} />
      <SelectInput label="Variant (optional)" value={row.variantId} disabled={!row.productId}
        onChange={changeVariant}
        options={availableVariants.map(v => ({ value: v.id, label: v.name }))}
        placeholder={availableVariants.length ? 'Choose size / specification' : 'No variants — product only'} />
    </div>
    {row.productId && !row.variantId && <div className="req-variant-inline">
      <TextInput label="Or type a new variant / specification" value={row.manualVariantName}
        onChange={value => set('manualVariantName', value)} placeholder="e.g. 50 mm / 6 metres" />
      {row.manualVariantName.trim() && <label className="req-catalog-toggle">
        <input type="checkbox" checked={row.saveToCatalog}
          onChange={event => set('saveToCatalog', event.target.checked)} />
        <span><b>Add this variant to the catalog</b><small>Keep it available for future purchases</small></span>
      </label>}
    </div>}</> : <>
      <div className="req-picker-grid">
        <TextInput label="Material / product name *" required value={row.manualProductName}
          onChange={value => set('manualProductName', value)} placeholder="e.g. UPVC Pipe" />
        <TextInput label="Variant / specification" value={row.manualVariantName}
          onChange={value => set('manualVariantName', value)} placeholder="e.g. 2 inch · 6 metre · Sch 40" />
      </div>
      <label className="req-catalog-toggle">
        <input type="checkbox" checked={row.saveToCatalog}
          onChange={event => set('saveToCatalog', event.target.checked)} />
        <span><b>Save in product catalog too</b><small>Reuse this product or variant in future projects and stock purchasing</small></span>
      </label>
    </>}
    <div className="req-fields-grid">
      <TextInput label="Extra description (optional)" value={row.description}
        onChange={value => set('description', value)} placeholder="Additional assembly or material details" />
      <DecimalField label="Quantity *" required min="0.001" value={row.quantity}
        onChange={value => set('quantity', value)} />
      <TextInput label="Unit *" value={row.unit} onChange={value => set('unit', value)} placeholder="Nos / Kg / Mtr / Ltr" required />
      <DecimalField label="Estimated rate (₹)" step="0.01" value={row.estimatedRate}
        onChange={value => set('estimatedRate', value)} />
    </div>
    <div className="req-note-row">
      <TextInput label="Remarks / assembly reference" value={row.notes} onChange={value => set('notes', value)}
        placeholder="Installation location, size notes, preferred brand, etc." />
      <div className="req-line-amount"><span>Estimated amount</span><strong>{cash(Number(row.quantity || 0) * Number(row.estimatedRate || 0))}</strong></div>
    </div>
  </div>;
}

export default function ProjectRequirementsPage() {
  const { can, changePage } = useApp();
  const { data: catalog, loading: catalogLoading, error: catalogError, reload: reloadCatalog } = useLoad('/project-requirements/catalog');
  const projects = catalog.projects || [];
  const products = catalog.products || [];
  const variants = catalog.variants || [];
  const [projectId, setProjectId] = useState(() => sessionStorage.getItem('cta_requirements_project') || '');
  const [rows, setRows] = useState(() => [createRow()]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const canEdit = can('procurement.edit');
  const { data: requirements, loading, error: loadError, reload } = useLoad(
    projectId ? `/project-requirements?projectId=${encodeURIComponent(projectId)}` : null, [projectId],
  );

  useEffect(() => {
    if (!catalogLoading && projects.length && !projects.some(project => String(project.id) === String(projectId))) {
      setProjectId(String(projects[0].id));
    }
  }, [catalogLoading, catalog, projectId]);

  const currentProject = projects.find(project => String(project.id) === String(projectId));
  const validRequirements = requirements.filter(item => String(item.projectId) === String(projectId));
  const existingEstimate = validRequirements.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.estimatedRate || 0), 0);
  const draftEstimate = useMemo(() => rows.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.estimatedRate || 0), 0), [rows]);
  const addRows = count => setRows(old => [...old, ...Array.from({ length: count }, createRow)]);
  const setRow = (key, next) => setRows(old => old.map(item => item.key === key ? next : item));
  const setProject = value => {
    setProjectId(value);
    sessionStorage.setItem('cta_requirements_project', value);
    setEditing(null);
    setNotice(''); setError('');
  };
  const storeAll = async event => {
    event.preventDefault();
    setError(''); setNotice('');
    if (!projectId) { setError('Choose a project first'); return; }
    setSaving(true);
    try {
      const { data } = await api.post('/project-requirements/bulk', {
        projectId: Number(projectId), items: rows.map(normalize),
      });
      setRows([createRow()]);
      setNotice(`${data.count} material${data.count === 1 ? '' : 's'} added successfully to ${currentProject?.name || 'the project'}.`);
      reload(); reloadCatalog();
    } catch (err) { setError(readError(err)); }
    finally { setSaving(false); }
  };
  const updateExisting = async event => {
    event.preventDefault(); setError(''); setNotice(''); setSaving(true);
    try {
      await api.patch(`/project-requirements/${editing.id}`, normalize(editing.draft));
      setEditing(null); setNotice('Material updated successfully.');
      reload(); reloadCatalog();
    } catch (err) { setError(readError(err)); }
    finally { setSaving(false); }
  };
  const deleteExisting = async row => {
    if (!window.confirm(`Delete "${row.description}" from this project? This cannot be undone.`)) return;
    setDeletingId(row.id); setError(''); setNotice('');
    try {
      await api.delete(`/project-requirements/${row.id}`);
      setNotice('Material removed from the project.'); reload();
    } catch (err) { setError(readError(err)); }
    finally { setDeletingId(null); }
  };
  const makeName = item => {
    const name = labelFor(products, item.productId) || item.manualProductName || item.description;
    const variant = labelFor(variants, item.variantId) || item.manualVariantName;
    return <span className="req-material-cell"><b>{name}</b>{variant && <small>{variant}</small>}{item.description !== name && !item.description.startsWith(`${name} —`) && <small>{item.description}</small>}</span>;
  };
  return <>
    <Head title="Project material requirements" description="Prepare the complete parts list for a project in one go — catalog items, variants and new materials." />
    <Notice error={catalogError || loadError || error} success={notice}/>
    <Panel title="Select project" subtitle="All materials are linked to the chosen company's project, and never mixed between businesses.">
      <div className="req-project-picker">
        <SelectInput label="Project *" value={projectId} onChange={setProject}
          options={projects.map(project => ({ value: project.id, label: `${project.code} · ${project.name}` }))}
          placeholder={catalogLoading ? 'Loading projects...' : 'Choose a project'} />
        <div className="req-project-context"><ShoppingBasket size={20}/><span>{currentProject ? <><b>{currentProject.name}</b><small>{currentProject.code} · {currentProject.status}</small></> : 'Create a project before adding materials'}</span></div>
      </div>
    </Panel>
    {!projects.length && !catalogLoading ? <Panel title="Start with a project"><Empty title="No project is available" text="Create a customer project first, then build its materials list."/><Btn icon={Plus} onClick={() => changePage('projects')}>Go to projects</Btn></Panel> : <>
      <div className="req-summary">
        <div><Layers3 size={21}/><span><small>Existing materials</small><b>{validRequirements.length}</b></span></div>
        <div><PackagePlus size={21}/><span><small>Planned cost</small><b>{cash(existingEstimate)}</b></span></div>
        <div><ShoppingBasket size={21}/><span><small>New rows being added</small><b>{rows.length}</b></span></div>
      </div>
      {canEdit && <form onSubmit={storeAll}>
        <Panel title="Add multiple required materials" subtitle="Prepare every part needed for an assembly. Choose from the catalog or enter materials that are not listed yet."
          actions={<span className="req-count">{rows.length} new {rows.length === 1 ? 'row' : 'rows'}</span>}>
          <div className="req-lines">
            {rows.map((row, index) => <MaterialEditor key={row.key} row={row} number={index + 1}
              products={products} variants={variants} update={next => setRow(row.key, next)}
              duplicate={() => setRows(old => [...old.slice(0, index + 1), { ...row, key: createRow().key }, ...old.slice(index + 1)])}
              remove={rows.length > 1 ? () => setRows(old => old.filter(item => item.key !== row.key)) : null} />)}
          </div>
          <div className="req-controls">
            <div className="req-append-buttons">
              <Btn kind="outline" icon={Plus} onClick={() => addRows(1)}>Add another material</Btn>
              <Btn kind="soft" icon={CopyPlus} onClick={() => addRows(5)}>Add 5 blank rows</Btn>
            </div>
            <div className="req-total"><span>New materials estimate</span><b>{cash(draftEstimate)}</b></div>
          </div>
          <div className="req-submit"><small>Save once to add all {rows.length} items. If any row is invalid, nothing is partially saved.</small>
            <Btn icon={Check} type="submit" disabled={saving || !projectId}>{saving ? 'Saving materials...' : `Save all ${rows.length} materials`}</Btn>
          </div>
        </Panel>
      </form>}
      <Panel title="Project requirements register" subtitle="Edit or remove individual open materials. Sourced, ordered or fulfilled requirements are protected from accidental changes."
        actions={<Btn kind="outline" small onClick={reload}>Refresh items</Btn>}>
        {loading ? <div className="loading-line"/> : <Table rows={validRequirements} empty="No materials added to this project yet."
          columns={[
            { label: 'Material and variant', render: makeName },
            { label: 'Qty', render: row => <b>{Number(row.quantity).toLocaleString('en-IN')} {row.unit || 'Nos'}</b> },
            { label: 'Est. unit rate', render: row => cash(row.estimatedRate) },
            { label: 'Estimated amount', render: row => cash(Number(row.estimatedRate || 0) * Number(row.quantity || 0)) },
            { label: 'Status', render: row => <Pill>{row.status}</Pill> },
            { label: 'Actions', render: row => canEdit ? <div className="req-table-actions">
              <button type="button" disabled={row.status !== 'OPEN'} title="Edit material" onClick={() => { setEditing({ id: row.id, draft: toEntry(row) }); setError(''); }}><Pencil size={16}/> Edit</button>
              <button type="button" disabled={row.status !== 'OPEN' || deletingId === row.id} className="danger" title="Delete material" onClick={() => deleteExisting(row)}><Trash2 size={16}/> Delete</button>
            </div> : '—' },
          ]}/>} 
      </Panel>
    </>}
    {editing && <div className="req-edit-layer" role="dialog" aria-modal="true" aria-label="Edit project requirement">
      <div className="req-edit-modal"><div className="req-edit-title"><div><h2>Edit required material</h2><p>Update this material without affecting the other requirements.</p></div><button type="button" title="Close editor" onClick={() => setEditing(null)}><X size={21}/></button></div>
        <Notice error={error}/>
        <form onSubmit={updateExisting}><MaterialEditor number={1} editable={false} row={editing.draft} products={products} variants={variants}
          update={next => setEditing(current => ({ ...current, draft: next }))}/>
          <div className="req-edit-actions"><Btn kind="outline" onClick={() => setEditing(null)}>Cancel</Btn><Btn type="submit" icon={Check} disabled={saving}>{saving ? 'Saving...' : 'Update material'}</Btn></div>
        </form>
      </div>
    </div>}
  </>;
}
