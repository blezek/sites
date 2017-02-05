class ThresholdGenerator extends FilterGenerator {
  // Performs a threshold filter
  // inputFields are:
  // - 0 grayscale image
  // outputFields are:
  // - 0 new filtered image
  constructor(options={}) {
    super(options);
  }

  updateProgram() {
    // recreate the program and textures for the current field list
    super.updateProgram();
  }

  _fragmentShaderSource() {
    console.log ( "Threshold brute..." );

    return (`${this.headerSource()}

      // Threshold
      //
      // Filter inputTexture0 using a threshold filter.  This is a single pass algorithm,
      // with fixed sigmas for intensity and range.
      //


      // these are the function definitions for sampleVolume*
      // and transferFunction*
      // that define a field at a sample point in space
      ${function() {
          let perFieldSamplingShaderSource = '';
          this.inputFields.forEach(field=>{
            perFieldSamplingShaderSource += field.samplingShaderSource();
          });
          return(perFieldSamplingShaderSource);
        }.bind(this)()
      }

      // Number of pixels in each dimension
      uniform ivec3 pixelDimensions;

      // scaling between texture coordinates and pixels, i.e. 1/256.0
      uniform vec3 textureToPixel;

      // integer sampler for first input Field
      uniform isampler3D inputTexture0;

      // output into first Field
      layout(location = 0) out int value;

      // Coordinate of input location, could be resampled elsewhere.
      in vec3 interpolatedTextureCoordinate;

      void main()
      {
        int background = texture(inputTexture0, interpolatedTextureCoordinate).r;
        // Threshold
        float threshold = 1200.0;
        value = background * int ( step ( threshold, float(background) ) );
      }
 
    `);
  }
}
