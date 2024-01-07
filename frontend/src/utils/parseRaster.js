/**
 * Create a representation of the raster data
 */
export function parse(arrayBuffer) {
  /**
   * The DataView view provides a low-level interface for reading and writing multiple number types in a binary ArrayBuffer, without having to care about the platform's endianness.
   */
  const dataView = new DataView(arrayBuffer);

  // Parse the raster metadata and create an object mapping metadata properties to their values
  const pairs_rm = RASTER_METADATA_PROPERTIES.map(({ name, byteOffset, type }) => [
    name,
    getDataViewValue(dataView, type, byteOffset),
  ]); // a list of pairs [metadata name, metadata value]

  const metadata = fromPairs(pairs_rm);

  // Parse each raster band and create an array of the results.
  const bands = [];
  let bytePointer = 61; // header raw length in bytes
  for (let i = 0; i < metadata.nBands; ++i) {
    const band = parseRasterband(metadata, dataView, bytePointer);
    bands.push(band);
    bytePointer += band.metadata.byteLength;
  }

  return { metadata, bands };
}

/**
 * Returns a representation of a raster band
 */
function parseRasterband(rasterMetadata, dataView, byteOffset) {
  // The first byte contains all metadata except the nodata value
  const firstByte = dataView.getUint8(byteOffset);

  // The pixtype is packed into the latter 4 bits. We use a bit mask to extract it.
  const pixtype = firstByte & 0b00001111;

  // pixtype is an integer ID representing the pixel type. To get more useful information, we find
  // the corresponding entry in the lookup table PIXEL_TYPES.
  const pixelType = PIXEL_TYPES.find(({ id }) => id === pixtype);
  const pixelByteLength = pixelType.byteLength;

  // length of the pixel data in bytes
  const dataLength = rasterMetadata.width * rasterMetadata.height * pixelByteLength;

  // length of the entire raster band in bytes (including the metadata byte and the nodata value)
  const byteLength = 1 + pixelByteLength + dataLength;

  // Parse the raster band metadata and create an object mapping metadata properties to their values.
  const pairs_rbm = RASTERBAND_METADATA_PROPERTIES.map(({ name, bitOffset }) => [
    // rasterband metadata name
    name,
    // Boolean value
    // To get the correct bit, we right-shift a bit mask by the bit offset.
    Boolean(firstByte & (0b10000000 >> bitOffset)),
  ]);

  const metadataProperties = fromPairs(pairs_rbm);

  /* 
    The final metadata object contains the metadata properties extracted from the binary representation as well as some useful computed properties, like the string representation of the pixel type and the length of the entire raster band in bytes.
  */
  const metadata = {
    ...metadataProperties,
    byteLength,
    pixtype,
    pixelType: pixelType.type,
    // If the band has a nodata value, get it.
    nodata: metadataProperties.hasNodataValue
      ? getDataViewValue(dataView, pixelType.type, byteOffset + 1) // +1 하는 이유는 isOffline, hasNodataValue, isNodataValue, reserved, pixtype 다 합하면 8bits = 1byte이기 때문
      : undefined,
  };

  // Get the Array constructor appropriate for the pixel type.
  const dataArrayConstructor = getArrayConstructor(pixelType.type);

  return {
    metadata,
    data: new dataArrayConstructor(
      dataView.buffer.slice(byteOffset + 1 + pixelByteLength, byteOffset + byteLength)
    ),
  };
}

/**
 * Convert a list of pairs [K, V] to a dictionary <K, V>
 */
function fromPairs(array) {
  const output = Object.create(null); // an empty object

  for (const [key, value] of array) {
    output[key] = value;
  }

  return output;
}

/**
 * Get a value of the specified type at a given byte offset in a DataView
 */
function getDataViewValue(dataView, type, byteOffset) {
  const dataViewGetter = dataView[`get${type}`] || dataView.getUint8;
  return dataViewGetter.call(dataView, byteOffset, LITTLE_ENDIAN);
}

/**
 * Gets the appropriate Array constructor to represent the pixel type
 */
function getArrayConstructor(pixelType) {
  switch (pixelType) {
    case 'Uint8':
      return Uint8Array;
    case 'Int8':
      return Int8Array;
    case 'Uint16':
      return Uint16Array;
    case 'Int16':
      return Int16Array;
    case 'Uint32':
      return Uint32Array;
    case 'Int32':
      return Int32Array;
    case 'Float32':
      return Float32Array;
    case 'Float64':
      return Float64Array;
    default:
      throw new Error(`Unrecognized pixel type: ${pixelType}`);
  }
}

/**
 * Is a machine little-endian?
 */
const LITTLE_ENDIAN = (function machineIsLittleEndian() {
  const uint8Array = new Uint8Array([0xaa, 0xbb]);
  const uint16array = new Uint16Array(uint8Array.buffer);
  return uint16array[0] === 0xbbaa;
})();

/**
 * lookup tables
 */
const RASTER_METADATA_PROPERTIES = [
  { name: 'endianness', byteOffset: 0, byteLength: 1, type: 'Uint8' },
  { name: 'version', byteOffset: 1, byteLength: 2, type: 'Uint16' },
  { name: 'nBands', byteOffset: 3, byteLength: 2, type: 'Uint16' },
  { name: 'scaleX', byteOffset: 5, byteLength: 8, type: 'Float64' },
  { name: 'scaleY', byteOffset: 13, byteLength: 8, type: 'Float64' },
  { name: 'ipX', byteOffset: 21, byteLength: 8, type: 'Float64' },
  { name: 'ipY', byteOffset: 29, byteLength: 8, type: 'Float64' },
  { name: 'skewX', byteOffset: 37, byteLength: 8, type: 'Float64' },
  { name: 'skewY', byteOffset: 45, byteLength: 8, type: 'Float64' },
  { name: 'srid', byteOffset: 53, byteLength: 4, type: 'Int32' },
  { name: 'width', byteOffset: 57, byteLength: 2, type: 'Uint16' },
  { name: 'height', byteOffset: 59, byteLength: 2, type: 'Uint16' },
];

/**
 * lookup tables
 */
const RASTERBAND_METADATA_PROPERTIES = [
  { name: 'isOffline', bitOffset: 0, bitLength: 1 },
  { name: 'hasNodataValue', bitOffset: 1, bitLength: 1 },
  { name: 'isNodataValue', bitOffset: 2, bitLength: 1 },
  // { name: 'reserved',       bitOffset: 3, bitLength: 1 },
];

/**
 * lookup tables
 */
const PIXEL_TYPES = [
  { type: 'Bool1', byteLength: 1, id: 0 },
  { type: 'Uint2', byteLength: 1, id: 1 },
  { type: 'Uint4', byteLength: 1, id: 2 },
  { type: 'Int8', byteLength: 1, id: 3 },
  { type: 'Uint8', byteLength: 1, id: 4 },
  { type: 'Int16', byteLength: 2, id: 5 },
  { type: 'Uint16', byteLength: 2, id: 6 },
  { type: 'Int32', byteLength: 4, id: 7 },
  { type: 'Uint32', byteLength: 4, id: 8 },
  { type: 'Float32', byteLength: 4, id: 10 },
  { type: 'Float64', byteLength: 8, id: 11 },
];
