import React from "react";
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/img/portfolio/1.jpg';
import img2 from '../assets/img/portfolio/10.jpg';
import img3 from '../assets/img/portfolio/3.jpg';
import img4 from '../assets/img/portfolio/4.jpg';
import img5 from '../assets/img/portfolio/5.jpg';
import img6 from '../assets/img/portfolio/6.jpg';
import svgCloseIcon from '../assets/img/close-icon.svg';

const portfolioModalsData = [
    {
        id: "portfolioModal1",
        databaseId: 2,
        title: "Calabresa",
        subtitle: "Clássica.",
        img: img1,
        description: "Tradicional e irresistível: fatias generosas de calabresa levemente apimentada, cobertas com cebola, orégano fresco e um toque especial do nosso molho artesanal. Assada até a borda ficar crocante e o sabor incomparável.",
        category: "Pizza",
        price: "R$ 42,00"
    },
    {
        id: "portfolioModal2",
        databaseId: 4,
        title: "Portuguesa",
        subtitle: "Vale a pena experimentar.",
        img: img2,
        description: "Queijo muçarela derretido, rodelas de tomate vibrante e folhas de manjericão fresco, tudo sobre uma massa clássica e levemente crocante. Uma simplicidade divina que celebra os sabores da Itália.",
        category: "Pizza",
        price: "R$ 40,00"
    },
    {
        id: "portfolioModal3",
        databaseId: 3,
        title: "Muçarela",
        subtitle: "Básica, mas extraordinária.",
        img: img3,
        description: "Simples, clássica e amada por todos. Coberta com uma generosa camada de muçarela derretida, realçada com um toque de orégano e nosso molho artesanal. Uma explosão de sabor a cada mordida.",
        category: "Pizza",
        price: "R$ 38,00"
    },
    {
        id: "portfolioModal4",
        databaseId: 7,
        title: "Coca-Cola",
        subtitle: "Refrigerante, sempre uma boa pedida!.",
        img: img4,
        description: "Clássica, refrescante e inconfundível. Servida sempre gelada, é a escolha perfeita para acompanhar qualquer pizza. O equilíbrio ideal entre sabor e efervescência que só a Coca tem.",
        category: "Bebida",
        price: "R$ 7,00"
    },
    {
        id: "portfolioModal5",
        databaseId: 21,
        title: "Pizza Doce Ovomaltine",
        subtitle: "Doce, incrível e colorida.",
        img: img5,
        description: "Doce na medida certa! Coberta com uma camada cremosa de chocolate ao leite, finalizada com confeitos, é a escolha perfeita para os amantes de sobremesa. Irresistivelmente deliciosa do início ao fim.",
        category: "Sobremesa",
        price: "R$ 55,00"
    },
    {
        id: "portfolioModal6",
        databaseId: 6,
        title: "Frango com Catupiry",
        subtitle: "Gostosa como nenhuma outra.",
        img: img6,
        description: "Frango desfiado bem temperado coberto com catupiry cremoso, tudo sobre uma base crocante e dourada. Uma mistura perfeita de textura e sabor que conquista todos os paladares.",
        category: "Pizza",
        price: "R$ 46,00"
    },
];

function PortfolioModals() {
    const navigate = useNavigate();

    const handleAddToCartAndGo = (portfolioItem) => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            const modalElement = document.getElementById(portfolioItem.id);
            if (modalElement) {
                let bsModalInstance = null;
                if (window.bootstrap && window.bootstrap.Modal) {
                    bsModalInstance = window.bootstrap.Modal.getInstance(modalElement);
                }

                if (bsModalInstance && typeof bsModalInstance.hide === 'function') {
                    const onModalHidden = () => {
                        modalElement.removeEventListener('hidden.bs.modal', onModalHidden);
                        document.body.classList.remove('modal-open');
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';
                        const backdrops = document.getElementsByClassName('modal-backdrop');
                        while (backdrops[0]) {
                            backdrops[0].parentNode.removeChild(backdrops[0]);
                        }
                        navigate('/login');
                    };
                    modalElement.addEventListener('hidden.bs.modal', onModalHidden);
                    bsModalInstance.hide();
                } else {
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    const backdrops = document.getElementsByClassName('modal-backdrop');
                    while (backdrops[0]) {
                        backdrops[0].parentNode.removeChild(backdrops[0]);
                    }
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
            return;
        }

        const priceString = portfolioItem.price ? portfolioItem.price.replace('R$ ', '').replace(',', '.') : '0';
        const priceNumber = parseFloat(priceString);

        if (isNaN(priceNumber)) {
            console.error("Preço inválido para o item:", portfolioItem);
            return;
        }

        const cartItemId = portfolioItem.databaseId || `fallback-${portfolioItem.id}`;
        if (!portfolioItem.databaseId) {
            console.warn(`Item ${portfolioItem.title} não possui databaseId. Usando fallback ID para o carrinho: ${cartItemId}`);
        }

        const cartItem = {
            id: cartItemId,
            name: portfolioItem.title,
            price: priceNumber,
            quantity: 1,
            image: portfolioItem.img,
            tipo: portfolioItem.category,
        };

        let cart = [];
        try {
            const localCart = localStorage.getItem('cart');
            if (localCart) {
                cart = JSON.parse(localCart);
            }
        } catch (e) {
            console.error("Erro ao ler carrinho do localStorage:", e);
            cart = [];
        }

        const existingItemIndex = cart.findIndex(ci => ci.id === cartItem.id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            const modalElement = document.getElementById(portfolioItem.id);

            if (modalElement) {
                let modalInstance = null;
                if (window.bootstrap && window.bootstrap.Modal) {
                    modalInstance = window.bootstrap.Modal.getInstance(modalElement);
                }

                if (modalInstance && typeof modalInstance.hide === 'function') {
                    const handleModalHidden = () => {
                        modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);
                        navigate('/carrinho');
                    };
                    modalElement.addEventListener('hidden.bs.modal', handleModalHidden);
                    modalInstance.hide();
                } else {
                    console.warn("Não foi possível obter a instância do modal Bootstrap ou o método 'hide' ao adicionar ao carrinho. Navegando diretamente.");
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    const backdrops = document.getElementsByClassName('modal-backdrop');
                    while(backdrops[0]) {
                        backdrops[0].parentNode.removeChild(backdrops[0]);
                    }
                    navigate('/carrinho');
                }
            } else {
                console.warn(`Elemento do modal com ID ${portfolioItem.id} não encontrado ao adicionar ao carrinho. Navegando diretamente.`);
                navigate('/carrinho');
            }
        } catch (e) {
            console.error("Erro ao salvar carrinho no localStorage ou ao tentar fechar modal:", e);
            alert("Erro ao adicionar item ao carrinho.");
        }
    };

    return (
        <>
            {portfolioModalsData.map((item) => (
                <div
                    className="portfolio-modal modal fade"
                    id={item.id}
                    tabIndex={-1}
                    role="dialog"
                    aria-labelledby={`${item.id}Label`}
                    aria-hidden="true"
                    key={item.id}
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="close-modal" data-bs-dismiss="modal" aria-label="Close">
                                <img src={svgCloseIcon} alt="Fechar modal" />
                            </div>
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8">
                                        <div className="modal-body">
                                            <h2 className="text-uppercase" id={`${item.id}Label`}>{item.title}</h2>
                                            <p className="item-intro text-muted">{item.subtitle}</p>
                                            <img
                                                className="img-fluid d-block mx-auto"
                                                src={item.img}
                                                alt={item.title}
                                                style={{ marginBottom: '2rem', maxHeight: '400px', objectFit: 'contain' }}
                                            />
                                            <p>{item.description}</p>
                                            {item.price && (
                                                <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#cf301d', marginTop: '1rem' }}>
                                                    Preço: {item.price}
                                                </p>
                                            )}
                                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                                <button
                                                    className="btn btn-secondary btn-xl text-uppercase"
                                                    data-bs-dismiss="modal"
                                                    type="button"
                                                >
                                                    Voltar ao Cardápio
                                                </button>
                                                <button
                                                    className="btn btn-primary btn-xl text-uppercase"
                                                    type="button"
                                                    onClick={() => handleAddToCartAndGo(item)}
                                                    style={{backgroundColor: '#cf301d', borderColor: '#cf301d'}}
                                                >
                                                    Pedir e Ir para Carrinho
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default PortfolioModals;