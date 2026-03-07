// 网站配置常量
export const SITE_CONFIG = {
    // 基础路径（用于 GitHub Pages 部署）
    basePath: '/portfolio',
  
    // 获取带 basePath 的图片路径
    getImagePath: (path: string) => {
      // 如果路径已经以 / 开头，需要替换 basePath
      if (path.startsWith('/')) {
        return `${SITE_CONFIG.basePath}${path}`;
      }
      return `${SITE_CONFIG.basePath}/${path}`;
    },
  };
  