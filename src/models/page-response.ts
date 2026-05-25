interface PageResponse<T> {
  items: T[];
  currentIndex: number;
  isLastIndex: boolean;
}
export default PageResponse;
