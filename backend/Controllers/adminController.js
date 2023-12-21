import Admin from "../Model/AdminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usermodel from "../Model/Usermodel.js";
import Vendormodel from "../Model/Vendormodel.js";
import { errorHandler } from "../utils/error.js";

export const adminLogin = async (req, res) => {
  const { adminEmail, adminPassword } = req.body;

  // res.send("asghvadghvh");
  try {
    const admin = await Admin.findOne({ adminEmail });
    if (admin) {
      if (adminPassword == admin.adminPassword) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
        const expiryDate = new Date(Date.now() + 3600000);
        return res
          .cookie("access_token", token, {
            httpOnly: true,
            expires: expiryDate,
          })
          .status(200)
          .json({ admin, message: "vendor login successful" });
      } else {
        return res.status(401).json("wrong credentials or invalid token");
      }
    } else {
      return res.status(401).json("you are not an authorized admin");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const listing = async (req, res) => {
  try {
    const viewers = await Usermodel.find();
    const vendors = await Vendormodel.find();

    res.status(200).json({ viewers, vendors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params._id;
  const { username, email } = req.body;

  try {
    const viewers = await Usermodel.findByIdAndUpdate(
      { id },
      { $set: { username, email } }
    );

    res.status(200).json({ message: "user updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateVendor = async (req, res) => {
  const id = req.params._id;
  const { username, email } = req.body;

  try {
    const viewers = await Vendormodel.findByIdAndUpdate(
      { id },
      { $set: { username, email } }
    );

    res.status(200).json({ message: "VENDOR updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const blockingUser = async (req, res) => {
  const id = req.params._id;

  try {
    const viewer = await Usermodel.findOne({ _id: id });

    const blockViewer = await Usermodel.findByIdAndUpdate(
      { id },
      { $set: { isAccess: !viewer.isAccess } }
    );

    res.status(200).json({ message: "user blocked" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const blockingVendor = async (req, res) => {
  const id = req.params._id;

  try {
    const viewer = await Vendormodel.findOne({ _id: id });

    const blockViewer = await Vendormodel.findByIdAndUpdate(
      { id },
      { $set: { isAccess: !viewer.isAccess } }
    );

    res.status(200).json({ message: "vendor blocked" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success!");
};


export const utility = async (req, res) => {
  try {
    
    const updatedVendor = await Usermodel.updateMany(
    {},
      {
        $unset: {
          booking:[]  }}
      ,{ new: true }
    )
    console.log(updatedVendor);
    // const updatedUser = await Usermodel.Update(
    //   {},
    //     {
    //       $set: {
    //         bookings:{}  }}
    //     ,{ new: true }
    //   )
      res.status(200).json(updatedVendor)
    } catch (error) {
      
      res.status(500).json(error)
  }

};