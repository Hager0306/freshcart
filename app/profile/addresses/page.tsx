"use client";

import { faLocationDot, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { phoneRe } from "@/components/Field";
import { Spinner } from "@/components/ui";
import { addAddress, errorMessage, getAddresses, removeAddress, type Address } from "@/lib/api";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 outline-none placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export default function AddressesPage() {
  const [list, setList] = useState<Address[] | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", details: "", phone: "", city: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAddresses().then(setList).catch(() => setList([]));
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.details.trim().length < 5 || !form.city.trim())
      return toast.error("Please fill in all the fields");
    if (!phoneRe.test(form.phone)) return toast.error("Enter a valid Egyptian phone number");
    setSaving(true);
    try {
      setList(await addAddress(form));
      setForm({ name: "", details: "", phone: "", city: "" });
      setOpen(false);
      toast.success("Address added successfully");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    try {
      setList(await removeAddress(id));
      toast.success("Address removed");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
          <p className="text-gray-600">Manage your saved delivery addresses</p>
        </div>
        {list && list.length > 0 && !open && (
          <button onClick={() => setOpen(true)} className="rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />Add Address
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={save} className="mb-6 grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
          <input className={inputCls} placeholder="Address name (Home, Work...)" value={form.name} onChange={set("name")} />
          <input className={inputCls} placeholder="City" value={form.city} onChange={set("city")} />
          <input className={`${inputCls} md:col-span-2`} placeholder="Street address, building, floor..." value={form.details} onChange={set("details")} />
          <input className={inputCls} type="tel" placeholder="01xxxxxxxxx" value={form.phone} onChange={set("phone")} />
          <div className="flex gap-3">
            <button disabled={saving} className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">{saving ? "Saving..." : "Save Address"}</button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {!list ? (
        <Spinner />
      ) : list.length === 0 && !open ? (
        <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-400"><FontAwesomeIcon icon={faLocationDot} /></span>
          <h3 className="mt-8 text-xl font-bold text-gray-900">No Addresses Yet</h3>
          <p className="mx-auto mt-3 max-w-sm text-lg text-gray-600">Add your first delivery address to make checkout faster and easier.</p>
          <button onClick={() => setOpen(true)} className="mt-8 rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700">
            <FontAwesomeIcon icon={faPlus} className="mr-3" />Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((a) => (
            <div key={a._id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><FontAwesomeIcon icon={faLocationDot} /></span>
                  <h3 className="text-lg font-semibold">{a.name}</h3>
                </div>
                <button onClick={() => del(a._id)} className="text-red-500 hover:text-red-600" aria-label="Delete"><FontAwesomeIcon icon={faTrashCan} /></button>
              </div>
              <p className="mt-4 text-gray-700">{a.details}</p>
              <p className="text-gray-600">{a.city}</p>
              <p className="text-gray-600">{a.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
