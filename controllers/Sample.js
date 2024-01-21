const DesignSample = require("../models/Samples");
const { StatusCodes } = require("http-status-codes");

// const uploadSample = async (req, res) => {
//   console.log(req.body);
//   console.log("Upload data hit");
//   const { title, description, types, designerID, category, images } = req.body; // Accessing data from the request body
//   // const images = JSON.parse(req.body.images); // Parsing the stringified images back to an array
//   console.log(category);

//   // const categoryObj = {
//   //   [category]: true, // Set the received category to true
//   // };

//   // Create the types object based on the received array
//   // const typesObj = types.reduce((acc, type) => {
//   //   acc[type] = true;
//   //   return acc;
//   // }, {});

//   try {
//     const newDesignSample = new DesignSample({
//       title,
//       description,
//       images,
//       // category: categoryObj,
//       // types: typesObj,
//       category,
//       type,
//       designerID,
//     });

//     console.log(newDesignSample);

//     const savedDesignSample = await newDesignSample.save();

//     res.status(StatusCodes.CREATED).json({
//       message: "Design sample uploaded successfully",
//       designSample: savedDesignSample,
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: "Could not upload the design sample",
//     });
//   }
// };

// const uploadSample = async (req, res) => {
//   console.log(req.body);
//   console.log("Upload data hit");

//   const { title, description, types, designerID, category, images } = req.body; // Destructuring data from the request body

//   const categoryObj = {
//     [category]: true,
//   };

//   const typesObj = types.reduce((acc, type) => {
//     acc[type] = true;
//     return acc;
//   }, {});

//   try {
//     const newDesignSample = new DesignSample({
//       title,
//       description,
//       images,
//       category: categoryObj,
//       types: typesObj,
//       designerID,
//     });

//     console.log(newDesignSample);

//     const savedDesignSample = await newDesignSample.save();

//     res.status(StatusCodes.CREATED).json({
//       message: "Design sample uploaded successfully",
//       designSample: savedDesignSample,
//     });
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: "Could not upload the design sample",
//     });
//   }
// };


const uploadSample = async (req, res) => {
  console.log(req.body);
  console.log("Upload data hit");
  const { title, description, types, designerID, category, images } = req.body;

  try {
    const newDesignSample = new DesignSample({
      title,
      description,
      images: JSON.parse(images),
      category: {
        modern: category.includes("modern"),
        contemporary: category.includes("contemporary"),
        traditional: category.includes("traditional"),
      },
      types: {
        kitchen: types.includes("kitchen"),
        bedroom: types.includes("bedroom"),
        office: types.includes("office"),
        bathroom: types.includes("bathroom"),
        gallery: types.includes("gallery"),
      },
      designerID,
    });

    console.log(newDesignSample);

    const savedDesignSample = await newDesignSample.save();

    res.status(StatusCodes.CREATED).json({
      message: "Design sample uploaded successfully",
      designSample: savedDesignSample,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Could not upload the design sample",
    });
  }
};


const getSample = async (req, res) => {
  const { user_id } = req.params;
  console.log(user_id);

  try {
    const allDesignSample = await DesignSample.find({ designerID: user_id });

    res.status(StatusCodes.CREATED).json({
      message: "Design sample found successfully",
      designSample: allDesignSample,
      hits: allDesignSample.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Could not find the design sample",
    });
  }
  //   res.status(StatusCodes.CREATED).json({ user_id });
};

const getSingleSample = async (req, res) => {
  const { sample_id } = req.params;
  console.log(sample_id);

  try {
    const allDesignSample = await DesignSample.find({ _id: sample_id });

    res.status(StatusCodes.CREATED).json({
      message: "Design sample found successfully",
      designSample: allDesignSample,
      hits: allDesignSample.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Could not find the design sample",
    });
  }
};

// const filterSample = async (req, res) => {
//   const { search, categories, interiorType, sortBy } = req.query;
//   console.log(search, categories, interiorType, sortBy);
// };

const filterSample = async (req, res) => {
  let {
    search,
    categories,
    interiorType,
    sortBy,
    page = 1,
    limit = 2,
  } = req.query;

  // Trim search query
  search = search ? search.trim() : "";

  // Parse categories and interiorType if provided
  categories = categories ? JSON.parse(categories) : {};
  interiorType = interiorType ? JSON.parse(interiorType) : {};

  const query = {};

  // Apply search query if provided
  if (search) {
    query.title = { $regex: new RegExp(search, "i") };
  }

  // Apply category filters if provided
  for (const category in categories) {
    if (categories[category]) {
      query[`category.${category}`] = true;
    }
  }

  // Apply interiorType filters if provided
  for (const type in interiorType) {
    if (interiorType[type]) {
      query[`types.${type}`] = true;
    }
  }

  // Set sort criteria if provided
  let sortCriteria = {};
  if (sortBy === "priceLowToHigh") {
    sortCriteria = { price: 1 };
  } else if (sortBy === "priceHighToLow") {
    sortCriteria = { price: -1 };
  } else if (sortBy === "rating") {
    sortCriteria = { rating: -1 };
  }

  try {
    let filteredDesignSamples;
    let totalCount;

    if (Object.keys(query).length === 0) {
      // If no filters are provided, retrieve total count and all records
      totalCount = await DesignSample.countDocuments({});
      filteredDesignSamples = await DesignSample.find({})
        .sort(sortCriteria)
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      // Find items in the DesignSample collection that match the constructed query
      totalCount = await DesignSample.countDocuments(query);
      filteredDesignSamples = await DesignSample.find(query)
        .sort(sortCriteria)
        .skip((page - 1) * limit)
        .limit(limit);
    }

    res.status(StatusCodes.OK).json({
      message: "Design samples found successfully",
      designSamples: filteredDesignSamples,
      hits: filteredDesignSamples.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Could not find the design samples",
    });
  }
};

const deleteSingleSample = async (req, res) => {
  const { sample_id } = req.params;
  console.log(sample_id);

  try {
    const allDesignSample = await DesignSample.deleteOne({ _id: sample_id });

    res.status(StatusCodes.CREATED).json({
      message: "Design sample deleted successfully",
      designSample: allDesignSample,
      hits: allDesignSample.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Could not deleted the design sample",
    });
  }
};

const updateSingleSample = async (req, res) => {
  const { sample_id } = req.params;

  try {
    const allDesignSample = await DesignSample.findByIdAndUpdate(
      { _id: sample_id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.CREATED).json({
      message: "Design sample updated successfully",
      designSample: allDesignSample,
      hits: allDesignSample.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Could not updated the design sample",
    });
  }
};

const getAllSamples = async (req, res) => {
  try {
    const allDesignSample = await DesignSample.find();

    res.status(StatusCodes.CREATED).json({
      message: "All sample found successfully",
      designSample: allDesignSample,
      hits: allDesignSample.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "No sample uploaded",
    });
  }
};

module.exports = {
  uploadSample,
  getSample,
  getSingleSample,
  deleteSingleSample,
  updateSingleSample,
  filterSample,
  getAllSamples,
};
