module.exports = {
  output: 'export',
  distDir: 'build',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {and: [/\.(js|ts)x?$/]},
      use: [
        {
          loader: '@svgr/webpack',
          options: {svgoConfig: {plugins: {removeViewBox: false}}},
        },
        'url-loader',
      ],
    });

    return config;
  },
};
