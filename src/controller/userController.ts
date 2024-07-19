import { Request, Response } from 'express';
import { User } from '../model/userModel';
import { v4 as uuidv4 } from 'uuid';
import { signUpUserSchema, options, loginUserSchema } from '../utils/utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Note } from '../model/noteModel';

const jwtsecret = process.env.JWT_SECRET as string;

// /* ====================== USER API ======================== */
export async function userInfo (req:Request, res:Response) {
  const userId = req.params.id
  const user = await User.findOne({where: {id: userId}});
  return res.send(user);
}

export async function signUp (req: Request, res: Response) {
  // console.log('req.body: ',req.body)
  if (req.method === 'GET') return res.render('Register');

  try {

    const newId = uuidv4();
    // Validate with Joi
    const validationResult = signUpUserSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const { password, confirm_password, email } = req.body;
    // Hash password
    const passwordHash = await bcrypt.hash(password, 8);
    const confirm_passwordHash = await bcrypt.hash(confirm_password, 8);

    // Create user
    // -check if user exist
    const user = await User.findOne({
      where: { email },
    });
    console.log(req.body)
    if (!user) {
      let newUser = await User.create({
        ...req.body, id: newId, password: passwordHash,
        confirm_password: confirm_passwordHash
      });

      // Generate token for user
      const user = (await User.findOne({
        where: { email: email },
      })) as unknown as { [key: string]: string };

      const { id } = user;

      const token = jwt.sign({ id }, jwtsecret, { expiresIn: '30mins' });

      res.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 1000 })

      // otp

      // Email

      // do your response here
      // return res.status(201).json({
      //   msg: 'user created successfully',
      //   newUser,
      //   token,
      // });
      return res.redirect('/users/login')
    }

    res.status(409).json({
      error: 'email already taken',
    });
  } catch (err:any) {
    console.log(err);
    res.status(500).json({ Error: err.message });
  }
};

export async function login (req: Request, res: Response) {
    console.log('hello james')
  if (req.method === 'GET') return res.render('Login');

  try {
    const { email, password } = req.body;
    // validate with joi
    const validationResult = loginUserSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    // Comfirm/Reconfirm token of user
    const user = (await User.findOne({
      where: { email: email },
    })) as unknown as { [key: string]: string };

    if (!user) return res.send('invalid login details');

    const validUser = await bcrypt.compare(password, user.password);

    if (!validUser) {
      return res.status(400).send('invalid login details');
    }

    const { id } = user;

    const token = jwt.sign({ id }, jwtsecret, { expiresIn: '30d' });

    res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
    return res.redirect('/notes/create')


  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: 'Internal server error' });
  }
};

export async function getUserAndNote (req: Request, res: Response) {
  console.log('hello james')
  try {
    const users = await User.findAll();

    return res.status(200).json({
      msg: 'You have successfully retrieve all data',
      users,
    });
  } catch (err) {
    console.log(err);
  }
};

export async function editUser (req: Request, res: Response) {

  if (req.method === 'GET') return res.render('edit')

  try {
    // notes/update-user/id
    const { id } = req.params; // or const id = req.params.id
    const { fullName, email, gender, phone, address } = req.body;
    // validate with Joi
    // const validationResult = signUpUserSchema.validate(req.body, options);

    // if (validationResult.error) {
    //   return res.status(400).json({
    //     error: validationResult.error.details[0].message,
    //   });
    // }

    const updateUser = await User.findOne({ where: { id } });

    if (!updateUser) {
      return res.status(400).json({
        error: 'Cannot find existing user',
      });
    }

    const updateRecord = await updateUser.update({fullName, email, gender, phone, address});

    return res.status(200).json({
      msg: 'User updated',
      updateRecord,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function logout (req: Request, res: Response) {
  try {
    // Clear the token cookie to log the user out
    res.clearCookie('token');
    // res.cookie("jwt", "", {httpOnly: true, expires: new Date(0)})

    // Redirect the user to the login page or another appropriate page
    return res.redirect('/users/login');
  } catch (err:any) {
    res.status(500).json({ Error: err.message });
  }
}

export async function deleteUser (req: Request, res: Response) {
  const userId = req.params.id;
  try {
    const user = await User.findOne({where: {id: userId}});
    if (!user) return res.send('User does not exist');
    await user.destroy();

  return res.send('user deleted successfully');
  } catch (error: any) {
    return res.status(500).send(error.message)
  }
  
}
