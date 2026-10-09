import ReactMarkdown from 'react-markdown';

export const MarkdowWrapper = ({ textBody }: { textBody: string }) => {
  return (
    <div className="prose">
      <ReactMarkdown>{textBody}</ReactMarkdown>
    </div>
  );
};
