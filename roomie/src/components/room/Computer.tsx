// components/room/Computer.tsx
import { RoomComponent } from '../../types/Room';

const Computer: RoomComponent = {
  preview: () => '/previews/computer.gif',
  supportedTypes: ['markdown'],
  render: ({ files, filter }) => {
    const filtered = applyFilter(files, filter, ['markdown']);
    return <ComputerUI documents={filtered} />;
  },
};

export default Computer;
