export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <p className="text-gray-700">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
