export default class Filters {
      minPrice?: number;
      maxPrice?: number;
      classLevelId?: number[];
      province?: string[]; // Địa chỉ - tỉnh
      district?: string[]; // Địa chỉ - quận
      ward?: string[]; // Địa chỉ - phường
      major?: number[]; // Ngành học
      isOnline?: boolean; // Hình thức học online hay offline
      maxLearners?: number;
      startedAt?: number | undefined | null; // Ngày bắt đầu (từ)
      endedAt?: number | undefined | null; // Ngày kết thúc (đến)
      sort?: string;
      gender?: number;
}