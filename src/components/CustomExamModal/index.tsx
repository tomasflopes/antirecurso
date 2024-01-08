import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import Slider from '../Slider';

interface ModalProps {
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  onClose?: () => void;
  params: {
    id: number;
    mode: string;
  };
}

const discounts = [
  { value: 0, label: '0%' },
  { value: 0.1, label: '10%' },
  { value: 0.25, label: '25%' },
  { value: 0.33, label: '33%' },
  { value: 0.5, label: '50%' },
  { value: 1, label: '100%' }
];

const CustomExamModal: React.FC<ModalProps> = ({ isVisible, setIsVisible, title, params }) => {
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [discount, setDiscount] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const closeWithEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    window.addEventListener('keydown', closeWithEsc);

    return () => window.removeEventListener('keydown', closeWithEsc);
  }, [setIsVisible]);

  const handleSaveClick = () => {
    if (numberOfQuestions && discount !== null) {
      setIsVisible(false);
      router.push(
        `/exams/${params.id}/answer/${params.mode}?n_of_questions=${numberOfQuestions}&penalizing_factor=${discount}`
      );
    } else {
      swal('Erro', 'Preencha todos os campos!', 'error');
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-screen bg-gray-500/60 p-20 z-20 items-center justify-center ${
        isVisible ? 'fixed' : 'hidden'
      }`}>
      <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center">
        <div
          className={`flex w-3/5 flex-col rounded-lg p-16 bg-gray-200 dark:bg-gray-700 items-center gap-y-6 justify-around relative min-h-[520px]`}>
          <button
            onClick={() => setIsVisible(false)}
            className="text-2xl font-black text-red-500 hover:text-red-600 z-20 absolute top-10 right-10">
            X
          </button>
          <span className="w-full text-center text-3xl font-black">{title}</span>
          <div className="max-h-[75vh] overflow-y-auto w-4/5">
            <div className="flex flex-col items-center justify-between">
              <h2 className="w-full font-bold mb-2 text-lg text-center md:text-left">
                Número de Questões
              </h2>
              <Slider min={1} max={50} value={numberOfQuestions} onChange={setNumberOfQuestions} />
              <span className="mt-2">
                Responde a{' '}
                <span className="text-primary md:text-lg font-black">{numberOfQuestions}</span>{' '}
                questões
              </span>
            </div>
            <div className="flex flex-col items-center justify-between gap-x-8 w-full mt-6">
              <h2 className="w-full font-bold mb-2 text-lg text-center md:text-left">
                Penalização nas perguntas
              </h2>
              <div className="w-full border-white border h-full md:h-10 flex flex-col md:flex-row items-center justify-center rounded-lg">
                {discounts.map((d, i) => (
                  <button
                    className={`${
                      i === 0
                        ? 'border-t-lg md:rounded-l-lg'
                        : i === discounts.length - 1
                        ? 'border-b-lg md:rounded-r-lg border-t md:border-l'
                        : 'border-t md:border-l'
                    } border-white w-full h-8 md:h-full hover:bg-primary hover:text-white
                    ${discount === d.value ? 'bg-primary text-white' : 'bg-transparent'}
                    `}
                    key={d.value}
                    onClick={() => setDiscount(d.value)}>
                    {d.label}
                  </button>
                ))}
              </div>
              <span className="md:text-sm text-xs mt-2">
                (Escolhe a percentagem de penalização para cada resposta errada)
              </span>
            </div>
          </div>
          <button
            name="criar exame"
            onClick={handleSaveClick}
            className="w-4/5 mt-4 p-2 text-xl dark:text-white rounded-md text-black bg-gray-300 dark:bg-primary-dark font-bold enabled:hover:bg-primary enabled:dark:hover:bg-primary hover:text-white"
            disabled={discount === null}>
            Criar exame
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomExamModal;
