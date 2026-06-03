/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page = 'home' | 'projects' | 'quote';
export type Language = 'ar' | 'en';

export interface Service {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  image: string;
  specsAr: string[];
  specsEn: string[];
}

export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'commercial' | 'office' | 'booth';
  clientAr: string;
  clientEn: string;
  year: string;
  area: string;
  locationAr: string;
  locationEn: string;
  descriptionAr: string;
  descriptionEn: string;
  mainImage: string;
  youtubeId?: string;
  images?: string[];
  featuresAr?: string[];
  featuresEn?: string[];
}

export interface QuoteRequest {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  serviceType: 'commercial' | 'office' | 'booth' | 'other';
  areaSize: number;
  budget: string;
  details: string;
  timeline: string;
}
