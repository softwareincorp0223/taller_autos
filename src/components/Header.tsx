
interface HeaderProps {
  titulo: string;
  subTitulo?: string;
}

export default function Header({ titulo, subTitulo }: HeaderProps) {

  return (
    <div className="">
      <h2 className="font-roboto text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {titulo}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-lg mt-2">
        {subTitulo}
      </p>
    </div>
  );

}