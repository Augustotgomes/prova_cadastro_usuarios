import { JSX, useEffect, useState } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { Formik, FormikProps } from "formik";
import {
  User,
  UserFormData,
  userValidationSchema,
  initialUserFormValues,
} from "../../interfaces";
import { useUserOperations, useViaCep } from "../../hooks";
import {
  userService,
  formatCpf,
  formatPhone,
  formatCep,
  formatDate,
  onlyNumbers,
} from "../../services";
import { LoadingButton, Loader } from "../Loader";

interface ModalUserProps {
  show: boolean;
  mode: "create" | "edit" | "view";
  userId?: string;
  onHide: () => void;
  onSuccess?: (user: User) => void;
}

export function ModalUser({
  show,
  mode,
  userId,
  onHide,
  onSuccess,
}: ModalUserProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const { createUser, editUser } = useUserOperations();
  const { searchAddress } = useViaCep();

  const isReadOnly = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  // Convert user data to form data
  const getUserFormData = (userData: User | null): UserFormData => {
    if (!userData) return initialUserFormValues;

    return {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      cpf: userData.cpf,
      birthDate: userData.birthDate,
      cep: userData.address.cep,
      street: userData.address.street,
      number: userData.address.number,
      complement: userData.address.complement || "",
      neighborhood: userData.address.neighborhood,
      city: userData.address.city,
      state: userData.address.state,
      uf: userData.address.uf,
    };
  };

  // Load user data for edit/view mode
  useEffect(() => {
    if ((isEdit || mode === "view") && userId && show) {
      setLoadingUser(true);
      userService
        .getUserById(userId)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error("Erro ao carregar usuário:", error);
        })
        .finally(() => {
          setLoadingUser(false);
        });
    } else {
      setUser(null);
    }
  }, [isEdit, mode, userId, show]);

  const handleCepBlur = async (
    cep: string,
    setFieldValue: FormikProps<UserFormData>["setFieldValue"]
  ) => {
    const cleanCep = onlyNumbers(cep);
    if (cleanCep.length === 8) {
      setCepLoading(true);
      try {
        const addressData = await searchAddress(formatCep(cleanCep));
        if (addressData) {
          setFieldValue("street", addressData.logradouro);
          setFieldValue("neighborhood", addressData.bairro);
          setFieldValue("city", addressData.localidade);
          setFieldValue("state", addressData.localidade); // Usually same as city for state name
          setFieldValue("uf", addressData.uf);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleSubmit = async (values: UserFormData) => {
    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        cpf: values.cpf,
        birthDate: values.birthDate,
        address: {
          cep: values.cep,
          street: values.street,
          number: values.number,
          complement: values.complement,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state,
          uf: values.uf,
        },
      };

      let result: User;
      if (isCreate) {
        result = await createUser(userData);
      } else {
        result = await editUser({ id: userId!, ...userData });
      }

      if (onSuccess) {
        onSuccess(result);
      }
      onHide();
    } catch (error) {
      // Error is handled by the hook
      console.error("Erro ao salvar usuário:", error);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Novo Usuário";
      case "edit":
        return "Editar Usuário";
      case "view":
        return "Visualizar Usuário";
      default:
        return "Usuário";
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loadingUser ? (
          <div className="text-center py-4">
            <Loader text="Carregando dados do usuário..." size="lg" />
          </div>
        ) : (
          <Formik
            enableReinitialize
            initialValues={getUserFormData(user)}
            validationSchema={userValidationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                {/* Personal Information */}
                <h6 className="text-primary mb-3">Dados Pessoais</h6>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome Completo *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.name && !!errors.name}
                        readOnly={isReadOnly}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>E-mail *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && !!errors.email}
                        readOnly={isReadOnly}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>CPF *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cpf"
                        value={formatCpf(values.cpf)}
                        onChange={(e) => {
                          const cleanValue = onlyNumbers(e.target.value);
                          setFieldValue("cpf", formatCpf(cleanValue));
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.cpf && !!errors.cpf}
                        readOnly={isReadOnly}
                        maxLength={14}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cpf}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telefone *</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formatPhone(values.phone)}
                        onChange={(e) => {
                          const cleanValue = onlyNumbers(e.target.value);
                          setFieldValue("phone", formatPhone(cleanValue));
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.phone && !!errors.phone}
                        readOnly={isReadOnly}
                        maxLength={15}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Data de Nascimento *</Form.Label>
                      <Form.Control
                        lang="pt-BR"
                        type="date"
                        name="birthDate"
                        value={formatDate(values.birthDate)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.birthDate && !!errors.birthDate}
                        readOnly={isReadOnly}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.birthDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Address Information */}
                <h6 className="text-primary mb-3 mt-4">Endereço</h6>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>CEP *</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          name="cep"
                          value={formatCep(values.cep)}
                          onChange={(e) => {
                            const cleanValue = onlyNumbers(e.target.value);
                            setFieldValue("cep", formatCep(cleanValue));
                          }}
                          onBlur={(e) => {
                            handleBlur(e);
                            if (!isReadOnly) {
                              handleCepBlur(e.target.value, setFieldValue);
                            }
                          }}
                          isInvalid={touched.cep && !!errors.cep}
                          readOnly={isReadOnly}
                          maxLength={9}
                        />
                        {cepLoading && (
                          <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                            <Loader size="sm" />
                          </div>
                        )}
                      </div>
                      <Form.Control.Feedback type="invalid">
                        {errors.cep}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Logradouro *</Form.Label>
                      <Form.Control
                        type="text"
                        name="street"
                        value={values.street}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.street && !!errors.street}
                        readOnly={isReadOnly}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.street}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número *</Form.Label>
                      <Form.Control
                        type="text"
                        name="number"
                        value={values.number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.number && !!errors.number}
                        readOnly={isReadOnly}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.number}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Complemento</Form.Label>
                      <Form.Control
                        type="text"
                        name="complement"
                        value={values.complement}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.complement && !!errors.complement}
                        readOnly={isReadOnly}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.complement}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bairro *</Form.Label>
                      <Form.Control
                        type="text"
                        name="neighborhood"
                        value={values.neighborhood}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.neighborhood && !!errors.neighborhood
                        }
                        readOnly={isReadOnly}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.neighborhood}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cidade *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.city && !!errors.city}
                        readOnly={isReadOnly}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado *</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={values.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.state && !!errors.state}
                        readOnly={isReadOnly}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.state}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>UF *</Form.Label>
                      <Form.Control
                        type="text"
                        name="uf"
                        value={values.uf.toUpperCase()}
                        onChange={(e) => {
                          setFieldValue("uf", e.target.value.toUpperCase());
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.uf && !!errors.uf}
                        readOnly={isReadOnly}
                        maxLength={2}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.uf}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Form Actions */}
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <LoadingButton
                    variant="secondary"
                    onClick={onHide}
                    disabled={isSubmitting}
                    loading={false}
                  >
                    {isReadOnly ? "Fechar" : "Cancelar"}
                  </LoadingButton>

                  {!isReadOnly && (
                    <LoadingButton
                      variant="primary"
                      type="submit"
                      loading={isSubmitting}
                    >
                      {isCreate ? "Criar Usuário" : "Salvar Alterações"}
                    </LoadingButton>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Modal.Body>
    </Modal>
  );
}
