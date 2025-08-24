'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api/clientApi';
import styles from './NoteForm.module.css';

interface NoteFormProps {
  onCancel?: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('All');
  const router = useRouter();
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/All');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createNoteMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      tag,
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={styles.select}
        >
          <option value="All">Всі</option>
          <option value="Work">Робота</option>
          <option value="Personal">Особисте</option>
          <option value="Ideas">Ідеї</option>
          <option value="Important">Важливо</option>
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