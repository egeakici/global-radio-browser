export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  country: string;
  countrycode: string;
  language: string;
  tags: string;
  votes: number;
  clickcount: number;
  bitrate: number;
  codec: string;
  hls: number;
}

export interface Country {
  name: string;
  iso_3166_1: string;
  stationcount: number;
}

export type AppMode = 'discovery' | 'map' | 'driving';

export interface StationList {
  id: string;
  name: string;
  stationuuids: string[];
}
