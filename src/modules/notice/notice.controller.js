import Notice from "./notice.model.js"

export const createNotice =
  async (req, res) => {

  try {

    const notice =
      await Notice.create(req.body);

    res.status(201).json(
      notice
    );

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to create notice"
    });

  }

};

// GET ALL NOTICES

export const getAllNotices = async (req, res) => {

  try {

    const notices = await Notice
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json(notices);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch notices"
    });

  }

};