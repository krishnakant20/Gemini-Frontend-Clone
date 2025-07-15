'use client';
import React from 'react';
import { toast } from 'react-toastify';

export default function ConfirmToast({ message, onConfirm }) {
  return toast(
    ({ closeToast }) => (
      <div className="flex flex-col gap-2 text-sm">
        <p>{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onConfirm();
              closeToast();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={closeToast}
            className="border px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      position: 'bottom-right',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    }
  );
}
