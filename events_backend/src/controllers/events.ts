
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import EventoModel from '../models/events';

const eventoModel = new EventoModel(supabase);

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { titulo, descricao, vagas, local, data_inicio, data_fim, status_aprovacao = 1 } = req.body;
    
    const evento = await eventoModel.insert({
      titulo,
      descricao,
      vagas,
      local,
      data_inicio: new Date(data_inicio),
      data_fim: new Date(data_fim),
      status_aprovacao
    });
    
    return res.status(201).json(evento);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const eventos = await eventoModel.getAll();
    return res.json(eventos);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evento = await eventoModel.get(parseInt(id));
    return res.json(evento);
  } catch (error: any) {
    return res.status(404).json({ error: 'Evento não encontrado.' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, vagas, local, data_inicio, data_fim, status_aprovacao } = req.body;
    
    const updateData: any = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (vagas !== undefined) updateData.vagas = vagas;
    if (local !== undefined) updateData.local = local;
    if (data_inicio !== undefined) updateData.data_inicio = new Date(data_inicio);
    if (data_fim !== undefined) updateData.data_fim = new Date(data_fim);
    if (status_aprovacao !== undefined) updateData.status_aprovacao = status_aprovacao;
    
    const evento = await eventoModel.patch(parseInt(id), updateData);
    return res.json(evento);
  } catch (error: any) {
    return res.status(404).json({ error: 'Evento não encontrado ou erro ao atualizar.' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await eventoModel.delete(parseInt(id));
    return res.status(204).send();
  } catch (error: any) {
    return res.status(404).json({ error: 'Evento não encontrado ou erro ao deletar.' });
  }
};
