'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api/clientApi';
import { useNoteStore } from '../../lib/store/noteStore';
import styles from './NoteForm.module.css';

interface NoteFormProps {
  onCancel?: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft(); // Скидаємо чернетковий стан після успішного створення
      router.push('/notes/filter/All');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) return;

    createNoteMutation.mutate({
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Заголовок
        </label>
        <input
          type="text"
          id="title"
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          className={styles.input}
          placeholder="Введіть заголовок нотатки"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>
          Зміст
        </label>
        <textarea
          id="content"
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          className={styles.textarea}
          placeholder="Введіть зміст нотатки"
          rows={6}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tag" className={styles.label}>
          Категорія
        </label>
        <select
          id="tag"
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value })}
          className={styles.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Скасувати
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Створення...' : 'Створити нотатку'}
        </button>
      </div>
    </form>
  );
}