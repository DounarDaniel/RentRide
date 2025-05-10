import addTransportStyles from './addTransportLoader.module.css';
import mapLoaderStyles from './mapLoader.module.css';
import defaultLoaderStyles from './defaultLoader.module.css';

export const addTransportLoader = `
<div class=${addTransportStyles.loader} id="loader">
    <div class=${addTransportStyles.truckWrapper}>
        <div class=${addTransportStyles.truckBody}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 198 93" class=${addTransportStyles.tiresvg}>
                <path stroke-width="3" stroke="#282828" fill="#F83D3D"
                    d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z">
                </path>
                <path stroke-width="3" stroke="#282828" fill="#7D7C7C"
                    d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z">
                </path>
                <path stroke-width="2" stroke="#282828" fill="#282828"
                    d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z">
                </path>
                <rect stroke-width="2" stroke="#282828" fill="#FFFCAB" rx="1" height="7" width="5" y="63" x="187">
                </rect>
                <rect stroke-width="2" stroke="#282828" fill="#282828" rx="1" height="11" width="4" y="81" x="193">
                </rect>
                <rect stroke-width="3" stroke="#282828" fill="#DFDFDF" rx="2.5" height="90" width="121" y="1.5"
                    x="6.5"></rect>
                <rect stroke-width="2" stroke="#282828" fill="#DFDFDF" rx="2" height="4" width="6" y="84" x="1">
                </rect>
            </svg>
        </div>
        <div class=${addTransportStyles.truckTires}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" class=${addTransportStyles.tiresvg}>
                <circle stroke-width="3" stroke="#282828" fill="#282828" r="13.5" cy="15" cx="15"></circle>
                <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" class=${addTransportStyles.tiresvg}>
                <circle stroke-width="3" stroke="#282828" fill="#282828" r="13.5" cy="15" cx="15"></circle>
                <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
            </svg>
        </div>
        <div class=${addTransportStyles.road}></div>

        <svg xml:space="preserve" viewBox="0 0 453.459 453.459" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg" id="Capa_1" version="1.1" fill="#000000" class=${addTransportStyles.lampPost}>
            <path d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
  c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
  c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
  c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
  h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
  v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
  V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
  M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
  h78.747C231.693,100.736,232.77,106.162,232.77,111.694z"></path>
        </svg>
    </div>
</div>`

export const mapLoader = `  
<div class=${mapLoaderStyles.earth} id="loader">
    <div class=${mapLoaderStyles.earthLoader}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path transform="translate(100 100)"
          d="M29.4,-17.4C33.1,1.8,27.6,16.1,11.5,31.6C-4.7,47,-31.5,63.6,-43,56C-54.5,48.4,-50.7,16.6,-41,-10.9C-31.3,-38.4,-15.6,-61.5,-1.4,-61C12.8,-60.5,25.7,-36.5,29.4,-17.4Z"
          fill="#7CC133"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path transform="translate(100 100)"
          d="M31.7,-55.8C40.3,-50,45.9,-39.9,49.7,-29.8C53.5,-19.8,55.5,-9.9,53.1,-1.4C50.6,7.1,43.6,14.1,41.8,27.6C40.1,41.1,43.4,61.1,37.3,67C31.2,72.9,15.6,64.8,1.5,62.2C-12.5,59.5,-25,62.3,-31.8,56.7C-38.5,51.1,-39.4,37.2,-49.3,26.3C-59.1,15.5,-78,7.7,-77.6,0.2C-77.2,-7.2,-57.4,-14.5,-49.3,-28.4C-41.2,-42.4,-44.7,-63,-38.5,-70.1C-32.2,-77.2,-16.1,-70.8,-2.3,-66.9C11.6,-63,23.1,-61.5,31.7,-55.8Z"
          fill="#7CC133"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path transform="translate(100 100)"
          d="M30.6,-49.2C42.5,-46.1,57.1,-43.7,67.6,-35.7C78.1,-27.6,84.6,-13.8,80.3,-2.4C76.1,8.9,61.2,17.8,52.5,29.1C43.8,40.3,41.4,53.9,33.7,64C26,74.1,13,80.6,2.2,76.9C-8.6,73.1,-17.3,59,-30.6,52.1C-43.9,45.3,-61.9,45.7,-74.1,38.2C-86.4,30.7,-92.9,15.4,-88.6,2.5C-84.4,-10.5,-69.4,-20.9,-60.7,-34.6C-52.1,-48.3,-49.8,-65.3,-40.7,-70C-31.6,-74.8,-15.8,-67.4,-3.2,-61.8C9.3,-56.1,18.6,-52.3,30.6,-49.2Z"
          fill="#7CC133"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path transform="translate(100 100)"
          d="M39.4,-66C48.6,-62.9,51.9,-47.4,52.9,-34.3C53.8,-21.3,52.4,-10.6,54.4,1.1C56.3,12.9,61.7,25.8,57.5,33.2C53.2,40.5,39.3,42.3,28.2,46C17,49.6,8.5,55.1,1.3,52.8C-5.9,50.5,-11.7,40.5,-23.6,37.2C-35.4,34,-53.3,37.5,-62,32.4C-70.7,27.4,-70.4,13.7,-72.4,-1.1C-74.3,-15.9,-78.6,-31.9,-73.3,-43C-68.1,-54.2,-53.3,-60.5,-39.5,-60.9C-25.7,-61.4,-12.9,-56,1.1,-58C15.1,-59.9,30.2,-69.2,39.4,-66Z"
          fill="#7CC133"></path>
      </svg>
    </div>
    
    <p>Connecting...</p>
</div>`

export const defaultLoader = `
<div class=${defaultLoaderStyles.loader} id="loader">
    <div class=${defaultLoaderStyles.bar1}></div>
    <div class=${defaultLoaderStyles.bar2}></div>
    <div class=${defaultLoaderStyles.bar3}></div>
    <div class=${defaultLoaderStyles.bar4}></div>
    <div class=${defaultLoaderStyles.bar5}></div>
    <div class=${defaultLoaderStyles.bar6}></div>
    <div class=${defaultLoaderStyles.bar7}></div>
    <div class=${defaultLoaderStyles.bar8}></div>
    <div class=${defaultLoaderStyles.bar9}></div>
    <div class=${defaultLoaderStyles.bar10}></div>
    <div class=${defaultLoaderStyles.bar11}></div>
    <div class=${defaultLoaderStyles.bar12}></div>
</div>
`