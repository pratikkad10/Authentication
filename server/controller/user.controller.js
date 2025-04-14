import User from "../models/user.model";
import dotenv from 'dotenv'
dotenv.config();

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already Exist!"
      });
    }

    const user = await User.create({ name, email, password });
    if (!user) {
      return res.status(400).json({
        message: "User not registered!"
      });
    }

    const token = crypto.getRandomBytes(32).toString("hex");
    user.verificationToken = token;

    await user.save();

    //mail user to verify email
    var transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_port,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: '<process.env.MAILTRAP_SENDEREMAIL>', // sender address
      to: user.email, // list of receivers
      subject: "Email verification!", // Subject line
      text: "click the following link to verify email", // plain text body
      html: `<a>${process.env.BASE_URL}/api/v1/users/verify/${token}</a>` // html body
    });

    res.status(201).json({
        message: "User registered successfully",
        success: true,
      });
  } catch (error) {
    res.status(400).json({
        message: "User not registered ",
        error,
        success: false,
    });
  }
};

const verifyUser = async (req, res) => {
    const {token} = req.params;
    try {
        if(!token){
            return res.status(400).json({
                message: "User not registered!"
              }); 
        }
        const user=await User.findOne({verificationToken:token})
        if(!user){
            return res.status(400).json({
                message: "User not found!"
            });
        }
        user.isVerified = true;
        user.verificationToken=undefined;
        await user.save();

        return res.status(200).json({
            message: "User successfully verified",
        });
    } catch (error) {
        res.status(400).json({
            message: "User not verified ",
            error,
            success: false,
        });
    }
};

const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({
                message: "Credentials required!"
            });
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "User not found!"
            });
        }

        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid email, password!"
            });
        }
        
        const payload={
            id:user._id,
            role:user.role
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'24h'})

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        };
        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
              id: user._id,
              name: user.name,
              role: user.role,
            },
          });

    } catch (error) {
        res.status(400).json({
            message: "User not logged in ",
            error,
            success: false,
        });
    }
};

export { register, verifyUser, login };
