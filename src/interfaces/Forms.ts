import * as Yup from 'yup';

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  uf: string;
}

export const userValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: Yup.string()
    .required('E-mail é obrigatório')
    .email('E-mail deve ter um formato válido'),
  
  phone: Yup.string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve ter o formato (XX) XXXXX-XXXX'),
  
  cpf: Yup.string()
    .required('CPF é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve ter o formato XXX.XXX.XXX-XX'),
  
  birthDate: Yup.string()
    .required('Data de nascimento é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve ter o formato YYYY-MM-DD'),
  
  cep: Yup.string()
    .required('CEP é obrigatório')
    .matches(/^\d{5}-\d{3}$/, 'CEP deve ter o formato XXXXX-XXX'),
  
  street: Yup.string()
    .required('Logradouro é obrigatório')
    .min(5, 'Logradouro deve ter pelo menos 5 caracteres'),
  
  number: Yup.string()
    .required('Número é obrigatório')
    .min(1, 'Número é obrigatório'),
  
  complement: Yup.string()
    .max(100, 'Complemento deve ter no máximo 100 caracteres'),
  
  neighborhood: Yup.string()
    .required('Bairro é obrigatório')
    .min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  
  city: Yup.string()
    .required('Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  
  state: Yup.string()
    .required('Estado é obrigatório')
    .min(2, 'Estado deve ter pelo menos 2 caracteres'),
  
  uf: Yup.string()
    .required('UF é obrigatória')
    .length(2, 'UF deve ter exatamente 2 caracteres')
    .uppercase('UF deve estar em maiúsculas'),
});

export const initialUserFormValues: UserFormData = {
  name: '',
  email: '',
  phone: '',
  cpf: '',
  birthDate: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  uf: '',
};

