// @flow

export type SearchResultProps = {|
  '@id': string,
  '@type': string,
  description: string,
  latitude: number,
  longitude: number,
  review_state: string,
  city: string,
  country: string,
  title: string,
  translations: TranslationsProps,
  image: any,
  effective: string,
  start: string,
  end: string,
  subjects: Array<string>,
  news_category: string,
  event_category: string,
  UID: string,
|};

export type TranslationsProps = {
  search_results_label: string,
  open_the_card_label: string,
  search_results_filters_label: string,
  open_the_card_label: string,
  no_results_label: string,
  previous_label: string,
  next_label: string,
  select_value_label: string,
  keep_reading_label: string,
  month_label: string,
  year_label: string,
  search_word_placeholder: string,
  language: string,
  from_label: string,
  to_label: string,
  single_day_label: string,
  search_course_help: string,
  search_course_help: string,
  search_course_placeholder: string,
  course_course_type_label: string,
  no_results_label: string,
};

// collection search
export type ResultItemContainerProps = {
  result: SearchResultProps,
  translations: TranslationsProps,
  // portalType: Array<string>,
};

export type SearchContainerState = {
  results: Array<SearchResultProps>,
  translations: TranslationsProps,
  batching: { numpages: number, current_page: number, pagesize: number },
  filters: any,
  setFilters: any,
  portalType: string | null,
};

export type SearchableTextInputProps = {
  onUpdateValue: any => void,
  translations: TranslationsProps,
};

export type SearchDateProps = {
  onUpdateValue: any => void,
  translations: TranslationsProps,
};

// course search
export type CourseData = {
  '@id': string,
  url: string,
  course_type: string,
  title: string,
  course_class: string,
  description: string,
  UID: string,
  location: string,
  year: string,
  course_type: string,
  course_venue: string,
  access_type: string,
  double_title: boolean,
  department: string,
  language: string,
};

export type LiveSearchInputProps = {
  courses: Array<CourseData>,
  course_type: string,
  SearchableText: string,
  onUpdate: any => void,
  translations: TranslationsProps | {},
  vocabulary: Object,
};

export type SelectCourseProps = {
  courseTypes: Array<string>,
  course_type: string,
  onUpdateSelect: any => void,
  translations: TranslationsProps | {},
};

export type SearchCoursesTileContainerState = {
  courses: Array<CourseData>,
  translations: TranslationsProps | {},
  courseTypes: Array<string>,
  course_type: string,
  SearchableText: string,
};

export type SearchCoursesViewContainerState = {
  results: Array<CourseData>,
  translations: TranslationsProps | {},
  formParameters: {
    courses: Array<CourseData>,
    course_type: string,
    SearchableText: string,
  },
  vocabulary: Object,
};

export type SearchCoursesFormProps = {
  course_type: string,
  SearchableText: string,
  courses: Array<CourseData>,
  translations: TranslationsProps | {},
  onSubmitHandle: any => void,
  onUpdateFormValue: any => void,
  vocabulary: Object,
};

export type SearchCoursesResultsProps = {
  results: Array<CourseData>,
  translations: TranslationsProps | {},
  vocabulary: Object,
};
