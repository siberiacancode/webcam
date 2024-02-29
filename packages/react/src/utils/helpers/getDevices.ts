export const getDevices = async () => {
  if (!('mediaDevices' in navigator && navigator.mediaDevices.enumerateDevices)) {
    return Promise.reject(
      new Error('Method enumerateDevices of Navigator is not implemented in this browser')
    );
  }

  return navigator.mediaDevices.enumerateDevices();
};
