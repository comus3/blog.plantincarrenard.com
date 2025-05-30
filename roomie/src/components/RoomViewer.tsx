// components/RoomViewer.tsx
import { Room , RoomFile } from '../types/Room';
import { roomComponentRegistry } from './room/registry';

export default function RoomViewer(props: { room: Room; files: RoomFile[] }) {
  const { model, backgroundImage, ambianceMusic, components } = props.room;

  return (
    <div
      class="relative w-full h-[600px]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
      }}
    >
      {ambianceMusic && (
        <audio autoplay loop>
          <source src={ambianceMusic} type="audio/mpeg" />
        </audio>
      )}

      {components.map((comp, index) => {
        const registryEntry = roomComponentRegistry[comp.type];
        const slot = model.componentSlots.find((s) => s.id === comp.slotId);
        if (!registryEntry || !slot) return null;

        return (
          <div key={comp.id} class={`absolute slot-${slot.position}`}>
            {registryEntry.render({
              files: props.files,
              filter: comp.filter,
              slot,
            })}
          </div>
        );
      })}
    </div>
  );
}
