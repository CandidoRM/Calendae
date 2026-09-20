import { splitContact, telHref, waHref } from "@/lib/contacts";

export function ContactLine({ value }: { value: string }) {
  const { name, phone, digits } = splitContact(value);
  const call = telHref(digits);
  const whats = waHref(digits);
  if (!phone || !call) return <>{value}</>;

  function keep(event: { stopPropagation: () => void }) {
    event.stopPropagation();
  }

  return (
    <span className="cal-contact" onClick={keep} onPointerDown={keep}>
      <a href={call} className="cal-contact-call">
        {name ? <span>{name} </span> : null}
        {phone}
      </a>
      {whats ? (
        <a href={whats} target="_blank" rel="noreferrer" className="cal-contact-wa">
          WhatsApp
        </a>
      ) : null}
    </span>
  );
}