import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../model/noteModel';
import { createNoteSchema, options, updateNoteSchema } from '../utils/utils';
import { User } from '../model/userModel';

 
export async function getNoteById (req: Request, res: Response) {

  const id = req.params.id
  try {
    const note = await Note.findOne({where: {id: id }})

    if(!note) {
      return res.send('note does not exist')
    }
    // console.log('note: ', note)
    return res.render('get-note', {
      id: id,
      note: note
    })
  } catch (error: any) {
    return res.json({error: error.message})
  }
}
export async function createNote (req: Request | any, res: Response) {
  if (req.method === "GET") res.render('create-note', {
    id: '',
    fullname: '',
    note: '',
  });

  try {
    const verified = req.user;

    const id = uuidv4();
    // validate with Joi
    const validationResult = createNoteSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const noteRecord = await Note.create({
      id,
      ...req.body,
      userId: verified.id,
    });

    // return res.status(201).json({
    //   msg: 'note created successfully',
    //   noteRecord,
    // });

    // return res.send(noteRecord.dataValues.id)
    return res.redirect('/notes')

  } catch (err) {
    console.log(err);
  }
};

export async function updateNote (req: Request, res: Response) {
  if (req.method === "GET") res.render('update-note', {
    fullname: '',
    note: '',
  });
  try {
    // notes/update-note/id
    const { id } = req.params; // or const id = req.params.id
    const { title, description, dueDate, status } = req.body;
    // validate with Joi
    const validationResult = updateNoteSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    const updateNote = await Note.findOne({ where: { id } });

    if (!updateNote) {
      return res.status(400).json({
        error: 'Cannot find existing note',
      });
    }

    const updateRecord = await updateNote.update({
      title,
      description,
      dueDate,
      status,
    });

    // return res.status(200).json({
    //   msg: 'You have updated your note',
    //   updateRecord,
    // });
    return res.redirect('/notes')
  } catch (error) {
    console.log(error);
  }
};

// export async function updateNote (req: Request, res: Response) {
//   try {
//     const { id } = req.params;
    
//     // Fetch the existing note from the database
//     const updateNote = await Note.findOne({ where: { id } });

//     if (!updateNote) {
//       return res.status(400).json({
//         error: 'Cannot find existing note',
//       });
//     }
    
//     // Validate the updated data using Joi
//     const { title, description, dueDate, status } = req.body;
//     const validationResult = updateNoteSchema.validate(req.body, options);

//     if (validationResult.error) {
//       return res.status(400).json({
//         error: validationResult.error.details[0].message,
//       });
//     }

//     res.render('update-note', { id, note: updateNote });
//   } catch (error) {
//     console.log(error);
//   }
// };

export async function deleteNote (req: Request, res: Response) {
  try {
    const { id } = req.params; // or const id = req.params.id
    const record = await Note.findOne({ where: { id } });
    if (!record) {
      return res.status(400).json({
        error: 'Cannot find existing note',
      });
    }

    const deletedRecord = await record.destroy();

    // return res.status(200).json({
    //   msg: 'You have successfully deleted your note',
    //   deletedRecord,
    // });
    return res.redirect('/note')
  } catch (error) {
    console.log(error);
  }
};

export async function dashboard (req: Request, res: Response) {
  const userId = req.user?.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    const notes = await Note.findAll({ where: { userId } })
    return res.render('user-dashboard', {
      id: userId,
      fullname: user.dataValues.fullName,
      notes,
    })
  } catch (error) {
    res.render('error')
  }

  // return res.json({msg: 'Hell/o user, welcome to your dashboard!', id: userId})
}