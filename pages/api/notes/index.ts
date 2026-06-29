import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { INotes } from '../../../db/models/Notes.model';
import Notes, { INoteId, ISaveNote } from './queries';
import { Filters } from '../../../utils/services';
import CustomError from '../../../utils/CustomError'

async function NewNote(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    const {
        Title,
        Description
    }: ISaveNote = req.body;

    try {
        const NewNote = await Notes.SaveNote({
            Title,
            Description
        });

        return res.status(200).json({
            message: 'Note saved successfully.',
            results: NewNote
        })
    } catch (error) {
        return res.status(409).json(new CustomError(409, error.message))
    }
};

async function GetNotes(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    const {
        Search,
        ItemsPerPage,
        PageNumber
    }: Filters = req.query;

    if (PageNumber && (isNaN(Number(PageNumber)) || Number(PageNumber) <= 0)) return res.status(400).json(new CustomError(400, 'The page number must be a number greater than 0.'));

    if (ItemsPerPage && (isNaN(Number(ItemsPerPage)) || Number(ItemsPerPage) <= 0)) return res.status(400).json(new CustomError(400, 'The items per page number must be a number greater than 0.'));

    const List = await Notes.GetNotes({ Search, PageNumber, ItemsPerPage })

    const Total = List.total;
    const CurrentPage: number = PageNumber && ItemsPerPage ? Number(PageNumber) : 1;
    const NumPages = Total > 1 ? Math.ceil(Number(Total) / Number(ItemsPerPage)) : 1;

    if (Number(PageNumber) > Number(NumPages)) return res.status(400).json(new CustomError(400, 'The page number entered exceeds the total number of pages.'));

    return res.status(200).json({
        message: 'Notes successfully displayed',
        results: List.results,
        numPages: NumPages ? NumPages : 1,
        currentPage: CurrentPage,
        total: List.total
    })
}

async function GetNoteById(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    const {
        NoteId
    }: INoteId = req.query;

    try {
        if (!NoteId) return res.status(409).json(new CustomError(409, 'Please, input an UUID value for Note Id.'));

        const Note = await Notes.GetNoteById({ NoteId });

        if (!Note) return res.status(404).json(new CustomError(404, 'The specific note does not exists.'));

        return res.status(200).json({
            message: 'Specific note by id sucessfully displayed.',
            results: Note
        })
    } catch (error) {
        return res.status(409).json(new CustomError(409, error.message))
    }
}

async function DeleteNoteById(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    const {
        NoteId
    }: INoteId = req.query;

    try {
        if (!NoteId) return res.status(409).json(new CustomError(409, 'Please, input an UUID value for Note Id.'));

        const Note = await Notes.GetNoteById({ NoteId });

        if (!Note) return res.status(404).json(new CustomError(404, 'The specific note does not exists.'));

        await Notes.DeleteNoteById({ NoteId });

        return res.status(200).json({
            message: 'Specific note successfully deleted.',
            results: Note
        })
    } catch (error) {
        return res.status(409).json(new CustomError(409, error.message))
    }
}

async function UpdateNoteById(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    const {
        Title,
        Description
    }: ISaveNote = req.body;

    const {
        NoteId
    }: INoteId = req.query;

    try {
        if (!NoteId) return res.status(409).json(new CustomError(409, 'Please, input an UUID value for Note Id.'));

        const Note = await Notes.GetNoteById({ NoteId });

        if (!Note) return res.status(404).json(new CustomError(404, 'The specific note does not exists.'));

        const NewNote = await Notes.UpdateNote({
            Title,
            Description,
            NoteId
        });

        return res.status(200).json({
            message: 'Specific note successfully updated.',
            results: NewNote
        })

    } catch (error) {
        return res.status(409).json(new CustomError(409, error.message))
    }
};

async function MarkAsDone(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    const {
        NoteId
    }: INoteId = req.query;

    try {
        if (!NoteId) return res.status(409).json(new CustomError(409, 'Please, input an UUID value for Note Id.'));

        const Note = await Notes.GetNoteById({ NoteId });

        if (!Note) return res.status(404).json(new CustomError(404, 'The specific note does not exists.'));

        const NewNote = await Notes.MarkAsDone({
            NoteId
        });

        return res.status(200).json({
            message: 'Specific note successfully marked as done.',
            results: NewNote
        })

    } catch (error) {
        return res.status(409).json(new CustomError(409, error.message))
    }
};

export default async function Index(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const { method, query } = req;

    switch (true) {
        case method == 'GET' && query.NoteId == undefined:
            await GetNotes(req, res);
            break;
        case method == 'POST':
            await NewNote(req, res);
            break;
        case method == 'GET' && (query.NoteId !== null || query.NoteId === '' || query.NoteId !== undefined):
            await GetNoteById(req, res);
            break;
        case method == 'DELETE':
            await DeleteNoteById(req, res);
            break;
        case method == 'PUT':
            await UpdateNoteById(req, res);
            break;
        case method == 'PATCH':
            await MarkAsDone(req, res);
            break;

        default:
            res.status(404).end();
            break;
    }
}