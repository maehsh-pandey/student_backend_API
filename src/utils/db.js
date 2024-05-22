db.students2.insertMany([
  {
    _id: 1,
    stdName: "A",
    age: 23,
    hobbies: ["cricket", "football"],
    gender: "male",
  },
  {
    _id: 2,
    stdName: "B",
    age: 20,
    hobbies: ["Painting", "Dance", "taken3"],
    gender: "male",
  },
  {
    _id: 3,
    stdName: "C",
    age: 21,
    hobbies: ["cricket", "football", "Photography"],
    gender: "male",
  },
  {
    _id: 4,
    stdName: "D",
    age: 23,
    hobbies: ["cricket", "Pottery", "taken3"],
    gender: "female",
  },
  {
    _id: 5,
    stdName: "E",
    age: 24,
    hobbies: ["Pottery", "Painting", "taken3"],
    gender: "male",
  },
  {
    _id: 6,
    stdName: "F",
    age: 23,
    hobbies: ["Woodworking", "football", "taken3"],
    gender: "male",
  },
  {
    _id: 7,
    stdName: "G",
    age: 27,
    hobbies: ["cricket", "football", "taken3"],
    gender: "female",
  },
  {
    _id: 8,
    stdName: "H",
    age: 20,
    hobbies: ["Painting", "Woodworking", "taken3"],
    gender: "male",
  },
  {
    _id: 9,
    stdName: "I",
    age: 24,
    hobbies: ["Woodworking", "football", "taken3"],
    gender: "male",
  },
  {
    _id: 10,
    stdName: "J",
    age: 21,
    hobbies: ["cricket", "Pottery", "taken3"],
    gender: "female",
  },
  {
    _id: 11,
    stdName: "k",
    age: 40,
    hobbies: ["cricket", "Pottery", "taken3"],
    gender: "female",
  },
  {
    _id: 12,
    stdName: "L",
    age: 41,
    hobbies: ["cricket", "Pottery", "taken3"],
    gender: "female",
  },
  {
    _id: 13,
    stdName: "M",
    age: 66,
    hobbies: ["cricket", "Pottery", "taken3"],
    gender: "female",
  },
  {
    _id: 14,
    stdName: "N",
    age: 26,
    hobbies: ["cricket", "Pottery", "taken3"],
    gender: "female",
  },
  {
    _id: 15,
    stdName: "O",
    age: 32,
    hobbies: ["cricket", "Pottery", "taken3"],
    gender: "female",
  },
  {
    _id: 16,
    stdName: "P",
    age: 22,
    hobbies: ["cricket", "Pottery", "taken3"],
    gender: "female",
  },
]);

db.students2.aggregate(
  { $match: { gender: "male" } },
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 30, 40],
      default: "Greater than 40 wala group",
      output: { count: { $sum: 1 } },
    },
  }
);

db.school.insertMany([
  { _id: 1, stdName: "A", rollNo: 12, marks: 95 },
  { _id: 2, stdName: "B", rollNo: 13, marks: 96 },
  { _id: 3, stdName: "C", rollNo: 14, marks: 92 },
  { _id: 4, stdName: "D", rollNo: 15, marks: 95 },
  { _id: 5, stdName: "E", rollNo: 16, marks: 96 },
  { _id: 6, stdName: "F", rollNo: 17, marks: 97 },
  { _id: 7, stdName: "G", rollNo: 18, marks: 91 },
  { _id: 8, stdName: "H", rollNo: 19, marks: 92 },
  { _id: 9, stdName: "I", rollNo: 20, marks: 94 },
  { _id: 10, stdName: "J", rollNo: 21, marks: 95 },
  { _id: 11, stdName: "K", rollNo: 22, marks: 96 },
  { _id: 12, stdName: "L", rollNo: 23, marks: 92 },
  { _id: 13, stdName: "M", rollNo: 24, marks: 93 },
  { _id: 14, stdName: "N", rollNo: 25, marks: 94 },
  { _id: 15, stdName: "0", rollNo: 6, marks: 95 },
]);

db.marks.aggregate([
  {
    $lookup: {
      from: "school",
      localField: "rollNo",
      foreignField: "rollNo",
      as: "Student_Marks",
    },
  },
  { $match: { Student_Marks: { $ne: [] } } },
]);

db.school.aggregate([
  {
    $lookup: {
      from: "marks",
      localField: "rollNo",
      foreignField: "rollNo",
      as: "marks",
    },
  },
  { $addFields: { ranks: [] } },
  { $out: "thirdCollection" },
]);

db.marks.aggregate([
  {
    $lookup: {
      from: "school",
      localField: "rollNo",
      foreignField: "rollNo",
      as: "ranks",
    },
  },
  { $merge: "thirdCollection" },
]);
