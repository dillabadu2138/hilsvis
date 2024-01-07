// default scalar variable values
export const default_scalar_values = [
  {
    mode: 'ocean',
    var_name: 'temp',
    var_name_kor: '수온',
    min: 0,
    max: 35,
    scheme: 'Blues',
    title: '수온(°C)',
    tickFormat: '.0f',
  },
  {
    mode: 'ocean',
    var_name: 'salt',
    var_name_kor: '염분',
    min: 0,
    max: 35,
    scheme: 'OrRd',
    title: '염분(psu)',
    tickFormat: '.0f',
  },
  {
    mode: 'ocean',
    var_name: 'zos',
    var_name_kor: '해수면',
    min: -1,
    max: 1,
    scheme: 'Plasma',
    title: '해수면(m)',
    tickFormat: '.1f',
  },
  // {
  //   mode: 'ocean',
  //   var_name: 'spd',
  //   var_name_kor: '유속',
  //   min: 0,
  //   max: 3,
  //   scheme: 'Cool',
  //   title: '유속(m/s)',
  //   tickFormat: '.1f',
  // },
  {
    mode: 'wave',
    var_name: 'VHM0',
    var_name_kor: '파고',
    min: 0,
    max: 3,
    scheme: 'Turbo',
    title: '유의파고(m)',
    tickFormat: '.1f',
  },
  {
    mode: 'wave',
    var_name: 'VTPK',
    var_name_kor: '파주기',
    min: 0,
    max: 5,
    scheme: 'Viridis',
    title: '파주기(s)',
    tickFormat: '.0f',
  },
  {
    mode: 'air',
    var_name: 'PRMSL',
    var_name_kor: '기압',
    min: 99000,
    max: 101000,
    scheme: 'Viridis',
    title: '기압(Pa)',
    tickFormat: '.0f',
  },
  {
    mode: 'air',
    var_name: 'TMP',
    var_name_kor: '기온',
    min: 250,
    max: 315,
    scheme: 'Turbo',
    title: '기온(K)',
    tickFormat: '.0f',
  },
  {
    mode: 'air',
    var_name: 'APCP',
    var_name_kor: '강수',
    min: 0,
    max: 5,
    scheme: 'Cool',
    title: '강수(kg/m^2)',
    tickFormat: '.0f',
  },
  // {
  //   mode: 'air',
  //   var_name: 'rh',
  //   var_name_kor: '습도',
  //   min: 0,
  //   max: 100,
  //   scheme: 'Viridis',
  //   title: '습도(%)',
  //   tickFormat: '+%',
  // },
];

// color schemes
export const color_schemes = [
  'Blues',
  'Cividis',
  'Cool',
  'GnBu',
  'Greens',
  'Inferno',
  'Magma',
  'Oranges',
  'OrRd',
  'Plasma',
  'Purples',
  'Reds',
  'Turbo',
  'Viridis',
  'Warm',
  'YlGn',
  'YlGnBu',
  'YlOrRd',
];

// earth radius in meter
export const EARTH_RADIUS_METERS = 6.3e6;

export const treeViewArr = [
  {
    id: '1',
    name: 'accidents',
    title: '사고',
    children: [
      {
        id: '2',
        name: 'kcg_nonship_accidents',
        title: '해양경찰청 비선박사고',
        description: '해양경찰청이 제공한 해양사고 DB를 수집/가공하여 구축',
        source: '공공데이터포털',
        url: 'https://www.data.go.kr/',
        parent: '1',
      },
      {
        id: '3',
        name: 'kcg_ship_accidents',
        title: '해양경찰청 선박사고',
        description: '해양경찰청이 제공한 해양사고 DB를 수집/가공하여 구축',
        source: '공공데이터포털',
        url: 'https://www.data.go.kr/',
        parent: '1',
      },
      {
        id: '4',
        name: 'kmst_ship_accidents',
        title: '중앙해양안전심판원 선박사고',
        img: '',
        description: '중앙해양안전심판원이 제공한 해양사고 DB를 수집/가공하여 구축',
        source: '중앙해양안전심판원 조사관실',
        url: 'https://kmst.go.kr',
        parent: '1',
      },
    ],
  },
  {
    id: '5',
    name: 'routes',
    title: '항로',
    children: [
      {
        id: '6',
        name: 'all_routes',
        title: '전체항로',
        description:
          '다양한 해양활동과 편의제공을 위한 요트 추천항로, 마리나 항만시설 등 안전하고 편리한 해양활동 정보를 제공. 요트 연결항로 및 접속항로에 대한 정보 제공',
        source: '개방海',
        url: 'http://www.khoa.go.kr/oceanmap',
        parent: '5',
      },
      {
        id: '7',
        name: 'designated_routes',
        title: '지정항로',
        description:
          '「선박의 입항 및 출항 등에 관한 법률」 제3장 제10조 1항에 따라 입출항 선박 및 그 주변 해역을 항해하는 선박이 안전하게 운항할 수 있도록 선박의 항로 지정하며 지정항로 범위정보 제공',
        source: '개방海',
        url: 'http://www.khoa.go.kr/oceanmap',
        parent: '5',
      },
      {
        id: '8',
        name: 'passenger_ship_routes',
        title: '여객항로',
        description: 'N/A',
        source: '연안여객선현황',
        url: 'https://www.komsa.or.kr',
        parent: '5',
      },
      {
        id: '9',
        name: 'ais_based_passenger_ship_routes',
        title: 'AIS기반 여객항로',
        description: 'AIS데이터를 기반으로 재정의한 여객선 항로 데이터',
        source: '올포랜드',
        url: 'https://www.all4land.com',
        parent: '5',
      },
      {
        id: '10',
        name: 'twoway_route_parts',
        title: '양길항로부',
        description:
          '제한된 경계내부의 항해에 위험하거나 어려운 수역에 선박의 안전한 통항을 제공하기 위하여 양길 교통이 설치된 항로. 양길 항로부는 양길 항로지대이다. 양길항로부에 대한 정보 제공',
        source: '개방海',
        url: 'http://www.khoa.go.kr/oceanmap',
        parent: '5',
      },
      {
        id: '11',
        name: 'yacht_routes',
        title: '요트항로',
        description: '레저활동 지원을 위한 요트항로 명칭, 거리, 소요시간등 관련 정보 제공',
        source: '개방海',
        url: 'http://www.khoa.go.kr/oceanmap',
        parent: '5',
      },
    ],
  },
  {
    id: '12',
    name: 'zones',
    title: '영역',
    children: [
      {
        id: '13',
        name: 'aids_to_navigation_areas',
        title: '항로표지설치해역',
        description: 'N/A',
        source: '국립해양조사원 해도수로과',
        url: 'https://www.khoa.go.kr/',
        parent: '12',
      },
      {
        id: '14',
        name: 'forecast_coastal_areas',
        title: '해양조사원 예보구역(협역)',
        description: 'N/A',
        source: '국립해양조사원 해양예보과',
        url: 'https://www.khoa.go.kr/',
        parent: '12',
      },
      {
        id: '15',
        name: 'forecast_regional_areas',
        title: '해양조사원 예보구역(광역)',
        description: 'N/A',
        source: '국립해양조사원 해양예보과',
        url: 'https://www.khoa.go.kr/',
        parent: '12',
      },
      {
        id: '16',
        name: 'forecast_kma_nearshore_areas',
        title: '기상청 예보구역도 앞바다',
        description: 'N/A',
        source: '기상청 해양기상개방포털',
        url: 'https://marine.kma.go.kr/mmis/',
        parent: '12',
      },
      {
        id: '17',
        name: 'traffic_safety_designated_areas',
        title: '교통안전특정해역',
        description:
          '「해사안전법」 제10조에 따라 해상교통량이 폭주하거나 거대선/위험화물운반선 등의 통항이 빈번하여 대형 해양사고가 발생할 우려가 있는 해역을 말하며 동법 제10조3항, 동법 시행령 제6조에 따른다. 교통안전특정해역에 대한 정보 제공',
        source: '개방海',
        url: 'http://www.khoa.go.kr/oceanmap',
        parent: '12',
      },
      {
        id: '18',
        name: 'tss_boundaries',
        title: '통항분리경계선',
        description:
          '선박충돌을 방지하기 위하여 입,출항 항로의 설정 등을 통하여 한쪽 방향으로만 항행할 수 있도록 분리한 항로의 경계선.',
        source: '개방海',
        url: 'http://www.khoa.go.kr/oceanmap',
        parent: '12',
      },
      {
        id: '19',
        name: 'tss_zones',
        title: '통항분리구역',
        description:
          '선박충돌을 방지하기 위하여 입,출항 항로의 설정 등을 통하여 한쪽 방향으로만 항행할 수 있도록 분리한 구역. 통항분리구역에 대한 정보 제공',
        source: '개방海',
        url: 'http://www.khoa.go.kr/oceanmap',
        parent: '12',
      },
    ],
  },
];
