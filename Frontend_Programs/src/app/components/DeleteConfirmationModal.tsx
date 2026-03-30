import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="space-y-5">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 
                        flex items-center justify-center border-2 border-red-500/30">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-card-foreground font-medium mb-2">
            Are you sure you want to delete this {itemType}?
          </p>
          <p className="text-sm text-muted-foreground mb-1">
            <span className="text-accent">{itemName}</span>
          </p>
          <p className="text-xs text-red-400">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 
                     text-white hover:from-red-600 hover:to-red-700 
                     transition-all duration-300 shadow-lg shadow-red-500/30 
                     hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02]
                     active:scale-[0.98] font-medium"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg bg-secondary text-card-foreground
                     border-2 border-border hover:border-primary/50 hover:bg-secondary/80 
                     transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
