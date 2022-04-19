export const ConfigManager = {
  getAppConfig: (key) => {
    switch (key) {
      case 'systemName':
        return 'Demo';
        break;

      default:
        break;
    }
  },
};
