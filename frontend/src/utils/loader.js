// Loaders.gl
import { load } from '@loaders.gl/core';
import { JSONLoader } from '@loaders.gl/json';

export const loadJson = async (path) => {
  return await load(path, JSONLoader);
};
