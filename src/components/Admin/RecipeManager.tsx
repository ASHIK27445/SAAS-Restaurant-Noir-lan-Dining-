import { useEffect, useMemo, useState } from "react";
import { ClipboardList, LoaderCircle, Plus, Save, Trash2, X } from "lucide-react";
import { getInventory } from "../../api/inventory";
import { createMenuRecipe, getMenuRecipes, saveRecipeMappings, type MenuRecipe } from "../../api/recipe";
import type { InventoryItem } from "../../types/inventory";

type RecipeRow = { ingredientName: string; quantity: string; unit: string };
type Props = { menuItem: { id: string; name: string; price: string }; onClose: () => void };

function unitGroup(unit: string) {
  const normalized = unit.trim().toLowerCase();
  if (["g", "gram", "grams"].includes(normalized)) return { group: "mass", factor: 1 };
  if (["kg", "kilogram", "kilograms"].includes(normalized)) return { group: "mass", factor: 1000 };
  if (["ml", "milliliter", "milliliters"].includes(normalized)) return { group: "volume", factor: 1 };
  if (["l", "liter", "liters", "litre", "litres"].includes(normalized)) return { group: "volume", factor: 1000 };
  if (["unit", "units", "piece", "pieces", "pc", "pcs"].includes(normalized)) return { group: "count", factor: 1 };
  return { group: normalized, factor: 1 };
}

function mappedQuantity(quantity: number, recipeUnit: string, inventoryUnit: string) {
  const from = unitGroup(recipeUnit);
  const to = unitGroup(inventoryUnit);
  return from.group === to.group ? quantity * from.factor / to.factor : null;
}

export default function RecipeManager({ menuItem, onClose }: Props) {
  const [recipes, setRecipes] = useState<MenuRecipe[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [rows, setRows] = useState<RecipeRow[]>([{ ingredientName: "", quantity: "", unit: "" }]);
  const [activeRecipe, setActiveRecipe] = useState<MenuRecipe | null>(null);
  const [mappingIds, setMappingIds] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"recipe" | "mapping">("recipe");
  const [changeNote, setChangeNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [recipeData, inventoryData] = await Promise.all([
        getMenuRecipes(menuItem.id),
        getInventory({ pageSize: 1000 }),
      ]);
      setRecipes(recipeData);
      setInventory(inventoryData.data);
      const active = recipeData.find((recipe) => recipe.isActive) ?? null;
      setActiveRecipe(active);
      if (active) {
        setRows(active.ingredients.map((ingredient) => ({
          ingredientName: ingredient.ingredientName,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })));
        setMappingIds(Object.fromEntries(
          active.ingredients
            .filter((ingredient) => ingredient.mapping)
            .map((ingredient) => [ingredient.id, ingredient.mapping!.inventoryItemId]),
        ));
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to load recipe data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [menuItem.id]);

  const totalMappedCost = useMemo(() => activeRecipe?.ingredients.reduce((total, ingredient) => {
    const item = inventory.find((candidate) => candidate.id === mappingIds[ingredient.id]);
    const quantity = item ? mappedQuantity(Number(ingredient.quantity), ingredient.unit, item.unit) : null;
    return total + (item && quantity !== null ? quantity * Number(item.costPerUnit) : 0);
  }, 0) ?? 0, [activeRecipe, inventory, mappingIds]);

  async function saveRecipe() {
    setError("");
    const validRows = rows.filter((row) => row.ingredientName.trim() && Number(row.quantity) > 0 && row.unit.trim());
    if (!validRows.length || validRows.length !== rows.length) {
      setError("Enter a name, positive quantity, and unit for every recipe row.");
      return;
    }
    if (new Set(validRows.map((row) => row.ingredientName.trim().toLowerCase())).size !== validRows.length) {
      setError("A recipe ingredient name can only be added once.");
      return;
    }
    setSaving(true);
    try {
      await createMenuRecipe(menuItem.id, {
        changeNote,
        ingredients: validRows.map((row) => ({
          ingredientName: row.ingredientName.trim(),
          quantity: Number(row.quantity),
          unit: row.unit.trim(),
        })),
      });
      await load();
      setChangeNote("");
      setTab("mapping");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to save recipe");
    } finally {
      setSaving(false);
    }
  }

  async function saveMappings() {
    if (!activeRecipe) return;
    setSaving(true);
    setError("");
    try {
      const updated = await saveRecipeMappings(
        menuItem.id,
        activeRecipe.id,
        Object.entries(mappingIds)
          .filter(([, inventoryItemId]) => inventoryItemId)
          .map(([recipeIngredientId, inventoryItemId]) => ({ recipeIngredientId, inventoryItemId })),
      );
      setActiveRecipe(updated);
      setRecipes((current) => current.map((recipe) => recipe.id === updated.id ? updated : recipe));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to save ingredient mapping");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-outline-variant/15 px-5 py-4">
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Recipe management</p><h2 className="font-headline text-xl text-primary">{menuItem.name}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close recipe manager" className="text-secondary hover:text-primary"><X size={19} /></button>
        </header>
        <div className="flex gap-1 border-b border-outline-variant/15 px-5 pt-3">
          <button type="button" onClick={() => setTab("recipe")} className={`rounded-t-lg px-4 py-2 text-xs font-bold ${tab === "recipe" ? "bg-primary text-on-primary" : "text-secondary"}`}>Recipe</button>
          <button type="button" onClick={() => setTab("mapping")} className={`rounded-t-lg px-4 py-2 text-xs font-bold ${tab === "mapping" ? "bg-primary text-on-primary" : "text-secondary"}`}>Ingredient Mapping & Cost</button>
        </div>
        <div className="min-h-0 overflow-y-auto p-5">
          {loading ? <div className="flex items-center gap-2 py-10 text-sm text-secondary"><LoaderCircle size={16} className="animate-spin" /> Loading recipe data...</div> : tab === "recipe" ? (
            <RecipeDefinition rows={rows} setRows={setRows} changeNote={changeNote} setChangeNote={setChangeNote} saving={saving} error={error} onSave={() => void saveRecipe()} />
          ) : (
            <MappingView activeRecipe={activeRecipe} inventory={inventory} mappingIds={mappingIds} setMappingIds={setMappingIds} totalMappedCost={totalMappedCost} saving={saving} error={error} onSave={() => void saveMappings()} />
          )}
          <section className="mt-8 border-t border-outline-variant/15 pt-5"><div className="flex items-center gap-2"><ClipboardList size={16} className="text-primary" /><h3 className="font-headline text-lg text-primary">Recipe history</h3></div><div className="mt-3 space-y-2">{recipes.length === 0 ? <p className="text-xs text-secondary">No recipe version saved yet.</p> : recipes.map((recipe) => <div key={recipe.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface-container-low px-3 py-2 text-xs"><span className="font-semibold text-primary">Version {recipe.version} {recipe.isActive && <span className="ml-1 rounded-full bg-primary/10 px-2 py-1 text-[10px]">Active</span>}</span><span className="text-secondary">{recipe.ingredients.length} recipe rows · {new Date(recipe.createdAt).toLocaleDateString()}</span></div>)}</div></section>
        </div>
      </div>
    </div>
  );
}

function RecipeDefinition({ rows, setRows, changeNote, setChangeNote, saving, error, onSave }: { rows: RecipeRow[]; setRows: React.Dispatch<React.SetStateAction<RecipeRow[]>>; changeNote: string; setChangeNote: (value: string) => void; saving: boolean; error: string; onSave: () => void }) {
  return <><p className="mb-4 text-sm text-secondary">Define what goes into one menu unit. Inventory mapping is done separately.</p><div className="overflow-x-auto rounded-lg border border-outline-variant/15"><table className="w-full min-w-150 text-left text-sm"><thead className="bg-surface-container-low text-[10px] uppercase tracking-widest text-secondary"><tr><th className="px-3 py-2">Recipe ingredient name</th><th className="px-3 py-2">Quantity per unit</th><th className="px-3 py-2">Unit</th><th /></tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-t border-outline-variant/10"><td className="px-3 py-2"><input value={row.ingredientName} onChange={(event) => setRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ingredientName: event.target.value } : item))} placeholder="Burger Bun" className="w-full rounded-md bg-surface-container-low px-2 py-2 text-xs" /></td><td className="px-3 py-2"><input type="number" min="0.001" step="0.001" value={row.quantity} onChange={(event) => setRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: event.target.value } : item))} className="w-28 rounded-md bg-surface-container-low px-2 py-2 text-xs" /></td><td className="px-3 py-2"><input value={row.unit} onChange={(event) => setRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, unit: event.target.value } : item))} placeholder="gram" className="w-24 rounded-md bg-surface-container-low px-2 py-2 text-xs" /></td><td className="px-3 py-2"><button type="button" onClick={() => setRows((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove recipe ingredient" className="text-error"><Trash2 size={15} /></button></td></tr>)}</tbody></table></div><button type="button" onClick={() => setRows((current) => [...current, { ingredientName: "", quantity: "", unit: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"><Plus size={14} /> Add recipe ingredient</button><div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end"><label className="text-xs font-semibold text-secondary">Change note<input value={changeNote} onChange={(event) => setChangeNote(event.target.value)} placeholder="Why was this recipe changed?" className="mt-1 block w-full rounded-md bg-surface-container-low px-3 py-2 text-sm font-normal" /></label><button type="button" onClick={onSave} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary disabled:opacity-50">{saving && <LoaderCircle size={14} className="animate-spin" />} Save recipe version</button></div>{error && <p role="alert" className="mt-4 text-xs text-error">{error}</p>}</>;
}

function MappingView({ activeRecipe, inventory, mappingIds, setMappingIds, totalMappedCost, saving, error, onSave }: { activeRecipe: MenuRecipe | null; inventory: InventoryItem[]; mappingIds: Record<string, string>; setMappingIds: React.Dispatch<React.SetStateAction<Record<string, string>>>; totalMappedCost: number; saving: boolean; error: string; onSave: () => void }) {
  if (!activeRecipe) return <p className="rounded-lg bg-surface-container-low p-4 text-sm text-secondary">Create a recipe first, then map its ingredients here.</p>;
  return <><p className="mb-4 text-sm text-secondary">Choose the inventory item separately. Stock and cost are shown using compatible units.</p><div className="overflow-x-auto rounded-lg border border-outline-variant/15"><table className="w-full min-w-190 text-left text-sm"><thead className="bg-surface-container-low text-[10px] uppercase tracking-widest text-secondary"><tr><th className="px-3 py-2">Recipe row</th><th className="px-3 py-2">Choose inventory item</th><th className="px-3 py-2">Current stock</th><th className="px-3 py-2">Unit price</th><th className="px-3 py-2">Cost per menu unit</th></tr></thead><tbody>{activeRecipe.ingredients.map((ingredient) => { const item = inventory.find((candidate) => candidate.id === mappingIds[ingredient.id]); const quantity = item ? mappedQuantity(Number(ingredient.quantity), ingredient.unit, item.unit) : null; return <tr key={ingredient.id} className="border-t border-outline-variant/10"><td className="px-3 py-3 font-semibold text-primary">{ingredient.ingredientName}<span className="ml-1 text-xs font-normal text-secondary">({ingredient.quantity} {ingredient.unit})</span></td><td className="px-3 py-2"><select value={mappingIds[ingredient.id] ?? ""} onChange={(event) => setMappingIds((current) => ({ ...current, [ingredient.id]: event.target.value }))} className="w-full rounded-md bg-surface-container-low px-2 py-2 text-xs"><option value="">Not mapped</option>{inventory.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}</select></td><td className="px-3 py-3 text-xs text-secondary">{item ? `${item.currentStock} ${item.unit}` : "-"}</td><td className="px-3 py-3 text-xs">{item ? `$${Number(item.costPerUnit).toFixed(2)} / ${item.unit}` : "-"}</td><td className="px-3 py-3 font-semibold text-primary">{item && quantity !== null ? `$${(quantity * Number(item.costPerUnit)).toFixed(2)}` : "-"}</td></tr>; })}</tbody></table></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-primary/10 px-4 py-3"><span className="text-xs text-secondary">Mapped {Object.keys(mappingIds).length} of {activeRecipe.ingredients.length} ingredients</span><span className="font-headline text-2xl text-primary">Total cost: ${totalMappedCost.toFixed(2)}</span></div><button type="button" onClick={onSave} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary disabled:opacity-50">{saving ? <LoaderCircle size={14} className="animate-spin" /> : <Save size={14} />} Save ingredient mapping</button>{error && <p role="alert" className="mt-4 text-xs text-error">{error}</p>}</>;
}
