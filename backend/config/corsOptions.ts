let whiteList = [
  'http://localhost:3000',
  'https://64668bb8a4a6bd0008276ad3--superlative-dango-7e09cd.netlify.app',
];
export const setCorsArray = (url) => {
  whiteList = [...whiteList, url];
};
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('not allowed by cors'));
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
