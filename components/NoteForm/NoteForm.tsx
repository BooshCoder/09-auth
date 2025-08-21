"use client";

import { useState, useEffect } from "react";
import css from "./NoteForm.module.css";
import { useNoteStore, initialDraft } from "../../lib/store/noteStore";
import { createNote } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NoteForm = () => {
  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);
  const router = useRouter();
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    clearDraft();
    setFormData(initialDraft);
    router.back();
  },
});
  const [formData, setFormData] = useState(draft ?? initialDraft);

useEffect(() => {
  setFormData(draft ?? initialDraft);
}, [draft]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDraft({ [name]: value } as Partial<typeof formData>);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await mutation.mutateAsync(formData);
};

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className={css.input}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          className={css.textarea}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={formData.tag}
          onChange={handleChange}
          className={css.select}
          required
        >
          <option value="">Оберіть тег</option>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

   <div className={css.actions}>
  <button
    type="button"
    className={css.cancelButton}
    onClick={() => router.back()}
  >
    Cancel
  </button>
 <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
  Create note
</button>
</div>
    </form>
  );
};

export default NoteForm;