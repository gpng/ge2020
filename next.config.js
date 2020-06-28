module.exports = {
  env: {
    // Will be available on both server and client
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },
  webpack: (config, { dev }) => {
    // Perform customizations to webpack config
    const newConfig = config;
    if (dev) {
      newConfig.module.rules.push({
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // eslint options (if necessary)
        },
      });
    }
    // Important: return the modified config
    return newConfig;
  },
  webpackDevMiddleware: (config) => config,
};
