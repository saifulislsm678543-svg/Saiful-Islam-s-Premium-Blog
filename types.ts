
export type Language = 'en' | 'bn';

export type PostType = 'featured' | 'postcard';

export type Collection = 'home' | 'written' | 'series';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  seoTitle: string;
  image: string;
  date: string;
  author: string;
  type: PostType;
  collection: Collection;
  seriesName?: string;
  episodeNumber?: number;
}

export interface SettingsState {
  theme: 'light' | 'dark';
  language: Language;
  enFont: string;
  bnFont: string;
  fontSize: number;
}

export const ENGLISH_FONTS = ['Roboto', 'Montserrat', 'Source Sans 3', 'Merriweather', 'Ubuntu'];
export const BENGALI_FONTS = ['Hind Siliguri', 'Noto Sans Bengali', 'Noto Serif Bengali', 'Anek Bangla', 'Atma'];

export const TRANSLATIONS = {
  en: {
    home: 'Home',
    writtenBlogs: 'My Written Blogs',
    seriesBlogs: 'Series Blogs',
    allBlogs: 'All Blogs',
    about: 'About',
    contact: 'Contact',
    changeLang: 'Change Language',
    welcome: 'Welcome to my blog website',
    searchPlaceholder: 'Search for articles, series...',
    clickToRead: 'Click to read',
    back: 'Back',
    seeAll: 'See all',
    close: 'Close',
    publish: 'Publish',
    cancel: 'Cancel',
    category: 'Category',
    title: 'Title',
    content: 'Content',
    author: 'Author',
    seoTitle: 'SEO Title',
    imageUpload: 'Upload Image',
    postType: 'Post Type',
    featured: 'Featured Post',
    postcard: 'Postcard',
    episodeName: 'Episode Name',
    seriesName: 'Series Name',
    incorrectPassword: 'Incorrect password',
    newPassword: 'New Password',
    confirm: 'Confirm',
    passwordPrompt: 'Enter Password',
    fontSettings: 'Font Settings',
    english: 'English',
    bengali: 'Bengali'
  },
  bn: {
    home: 'হোম',
    writtenBlogs: 'আমার লিখিত ব্লগ',
    seriesBlogs: 'সিরিজ ব্লগ',
    allBlogs: 'সকল ব্লগ',
    about: 'ওয়েবসাইট সম্পর্কে',
    contact: 'যোগাযোগ',
    changeLang: 'ভাষা পরিবর্তন করুন',
    welcome: 'আমার ব্লগ ওয়েবসাইটে স্বাগতম',
    searchPlaceholder: 'আর্টিকেল, সিরিজ বা লেখা খুঁজুন...',
    clickToRead: 'ক্লিক করে পড়ুন',
    back: 'ফিরে যান',
    seeAll: 'সব দেখুন',
    close: 'বন্ধ করুন',
    publish: 'পাবলিশ',
    cancel: 'বাতিল',
    category: 'ক্যাটাগরি',
    title: 'শিরোনাম',
    content: 'মূল লেখা',
    author: 'লেখকের নাম',
    seoTitle: 'সার্চ ইঞ্জিন টাইটেল',
    imageUpload: 'ছবি আপলোড',
    postType: 'পোস্টের ধরন',
    featured: 'ফিচারড পোস্ট',
    postcard: 'পোস্টকার্ড',
    episodeName: 'এপিসোডের নাম',
    seriesName: 'সিরিজের নাম',
    incorrectPassword: 'ভুল পাসওয়ার্ড',
    newPassword: 'নতুন পাসওয়ার্ড',
    confirm: 'নিশ্চিত করুন',
    passwordPrompt: 'পাসওয়ার্ড দিন',
    fontSettings: 'ফন্ট সেটিং',
    english: 'ইংরেজি',
    bengali: 'বাংলা'
  }
};
