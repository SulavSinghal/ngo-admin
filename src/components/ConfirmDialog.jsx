import React from 'react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'default' // default, danger, warning
}) => {
  if (!isOpen) return null;

  const getButtonClasses = () => {
    switch (type) {
      case 'danger':
        return 'px-4 py-2 rounded-md font-medium bg-red-600 text-white hover:bg-red-700 transition-colors';
      case 'warning':
        return 'px-4 py-2 rounded-md font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors';
      default:
        return 'px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {type === 'danger' && (
                  <span className="text-red-600 text-xl">⚠️</span>
                )}
                {type === 'warning' && (
                  <span className="text-yellow-600 text-xl">⚠️</span>
                )}
                {type === 'default' && (
                  <span className="text-blue-600 text-xl">ℹ️</span>
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={getButtonClasses()}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
              onClick={onClose}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
