'use client';

import { useState } from 'react';
import {
  Tile,
  Button,
  Toggle,
  Tag,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  Grid,
  Column,
} from '@carbon/react';
import {
  Add,
  Settings,
  Catalog,
  ShoppingCart,
  Star,
  Checkmark,
} from '@carbon/icons-react';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  active: boolean;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

export default function ServicesPage() {
  const [packages, setPackages] = useState<Package[]>([
    {
      id: '1',
      name: 'Essencial',
      description: 'Pacote básico para começar',
      price: 2500,
      features: ['5 posts por mês', 'Suporte básico', '1 plataforma'],
      active: true,
    },
    {
      id: '2',
      name: 'Profissional',
      description: 'Pacote completo para crescimento',
      price: 5000,
      features: [
        '15 posts por mês',
        'Suporte prioritário',
        '3 plataformas',
        'Análise mensal',
      ],
      active: true,
    },
    {
      id: '3',
      name: 'Premium',
      description: 'Pacote all-in com estratégia completa',
      price: 12000,
      features: [
        'Posts ilimitados',
        'Suporte 24/7',
        'Todas as plataformas',
        'Consultoria estratégica',
        'Relatório semanal',
      ],
      active: false,
    },
  ]);

  const [addOns, setAddOns] = useState<AddOn[]>([
    {
      id: 'a1',
      name: 'Design Gráfico',
      description: 'Criação de artes personalizadas',
      price: 500,
      active: true,
    },
    {
      id: 'a2',
      name: 'Copywriting',
      description: 'Redação profissional de conteúdo',
      price: 300,
      active: true,
    },
    {
      id: 'a3',
      name: 'Video Editing',
      description: 'Edição e produção de vídeos',
      price: 800,
      active: true,
    },
    {
      id: 'a4',
      name: 'Consultoria',
      description: 'Reunião de 1 hora com especialista',
      price: 400,
      active: false,
    },
  ]);

  const togglePackageStatus = (id: string) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === id ? { ...pkg, active: !pkg.active } : pkg
      )
    );
  };

  const toggleAddOnStatus = (id: string) => {
    setAddOns(
      addOns.map((addon) =>
        addon.id === id ? { ...addon, active: !addon.active } : addon
      )
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Serviços</h1>
        <p style={{ fontSize: '1rem', color: '#525252', marginBottom: '2rem' }}>
          Configure seus pacotes de serviços e complementos
        </p>
      </div>

      {/* Packages Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Catalog size={24} />
            Pacotes
          </h2>
          <Button kind="primary" size="sm" renderIcon={Add}>
            Novo Pacote
          </Button>
        </div>

        <Grid>
          {packages.map((pkg) => (
            <Column key={pkg.id} lg={4} md={6} sm={4}>
              <Tile style={{ padding: '1.5rem', position: 'relative' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                      {pkg.name}
                    </h3>
                    <p style={{ color: '#525252', marginBottom: '0.5rem' }}>
                      {pkg.description}
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#24A148' }}>
                      {formatPrice(pkg.price)}/mês
                    </p>
                  </div>
                  <Toggle
                    id={`toggle-pkg-${pkg.id}`}
                    toggled={pkg.active}
                    onToggle={() => togglePackageStatus(pkg.id)}
                    size="sm"
                  />
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Funcionalidades:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {pkg.features.map((feature, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.25rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        <Checkmark size={16} style={{ color: '#24A148' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <Tag type={pkg.active ? 'green' : 'gray'} size="sm">
                    {pkg.active ? 'Ativo' : 'Inativo'}
                  </Tag>
                </div>

                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={Settings}
                  style={{ marginTop: '1rem' }}
                >
                  Editar
                </Button>
              </Tile>
            </Column>
          ))}
        </Grid>
      </div>

      {/* Add-ons Section */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={24} />
            Complementos
          </h2>
          <Button kind="primary" size="sm" renderIcon={Add}>
            Novo Complemento
          </Button>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '4px' }}>
          <StructuredListWrapper selection isCondensed={false}>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Nome</StructuredListCell>
                <StructuredListCell head>Descrição</StructuredListCell>
                <StructuredListCell head>Preço</StructuredListCell>
                <StructuredListCell head>Status</StructuredListCell>
                <StructuredListCell head>Ações</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {addOns.map((addon) => (
                <StructuredListRow key={addon.id}>
                  <StructuredListCell>{addon.name}</StructuredListCell>
                  <StructuredListCell>{addon.description}</StructuredListCell>
                  <StructuredListCell>
                    <span style={{ fontWeight: 'bold', color: '#24A148' }}>
                      {formatPrice(addon.price)}
                    </span>
                  </StructuredListCell>
                  <StructuredListCell>
                    <Tag type={addon.active ? 'green' : 'gray'} size="sm">
                      {addon.active ? 'Ativo' : 'Inativo'}
                    </Tag>
                  </StructuredListCell>
                  <StructuredListCell>
                    <Toggle
                      id={`toggle-addon-${addon.id}`}
                      toggled={addon.active}
                      onToggle={() => toggleAddOnStatus(addon.id)}
                      size="sm"
                    />
                  </StructuredListCell>
                </StructuredListRow>
              ))}
            </StructuredListBody>
          </StructuredListWrapper>
        </div>
      </div>
    </div>
  );
}
