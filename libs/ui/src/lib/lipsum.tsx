import { useId } from 'react';

export const Lipsum = () => {
  const id = useId();

  return (
    <div id={`lipsum-${id}`}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
        accumsan pretium elit, sit amet facilisis est placerat et. Quisque
        tempor feugiat felis feugiat pellentesque. Donec faucibus a risus vitae
        maximus. In consequat erat eget ex pretium feugiat. Integer leo orci,
        commodo vitae sagittis sit amet, gravida in magna. Duis vitae dictum
        leo, ac convallis erat. Mauris vel fringilla urna. Aenean semper
        placerat lobortis. Proin vulputate eget est vitae lacinia. Etiam ut
        dictum est, a vestibulum sem. Sed sit amet neque metus. Donec id ipsum
        at nisl facilisis viverra sit amet a tortor. Phasellus vel mauris vitae
        sem rutrum ultricies. Ut nec erat mi. Donec in lacus sed nulla
        sollicitudin egestas nec vel turpis.
      </p>
      <p>
        Vivamus et justo viverra, cursus justo at, elementum augue. Vivamus
        venenatis commodo congue. Praesent facilisis iaculis nisi, sed semper
        nunc aliquam pretium. Suspendisse congue ante enim, ac sollicitudin enim
        dignissim et. Maecenas ante justo, dignissim at lectus ut, lobortis
        scelerisque risus. Pellentesque sed tristique libero. Curabitur vel urna
        et mi bibendum elementum vitae vel odio. Sed ligula velit, fringilla non
        magna gravida, gravida posuere nisi. Duis vulputate urna in sollicitudin
        mollis. Curabitur pharetra felis felis, maximus pellentesque sem
        sagittis facilisis. Phasellus sed sapien arcu. Morbi vehicula ligula
        quis mi feugiat, sed tincidunt quam ullamcorper. Vestibulum ante ipsum
        primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi
        eu dictum ante. Cras convallis maximus nulla, vitae aliquam nisi.
      </p>
      <p>
        Nulla id pretium lorem. Sed id nisi viverra, laoreet purus nec, dapibus
        velit. Nunc auctor a ipsum non dapibus. Etiam egestas porta risus, id
        convallis nisi. Nunc at orci scelerisque, rhoncus ante ac, mattis orci.
        Maecenas elit nibh, porttitor in nulla in, imperdiet bibendum ex. Donec
        vitae ligula placerat, tristique ligula eget, porttitor eros. Phasellus
        libero justo, rutrum vestibulum dui a, sollicitudin posuere diam. Nullam
        laoreet id urna eu elementum. Nunc eget libero massa. Vestibulum ante
        ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
        Integer gravida sapien nec volutpat porta.
      </p>
      <p>
        Integer viverra non lorem non iaculis. Integer euismod efficitur
        suscipit. Cras sit amet vulputate lectus. Phasellus iaculis dapibus
        rhoncus. Pellentesque mollis magna sit amet feugiat fringilla. Curabitur
        rutrum, dui eu commodo ultrices, arcu odio sodales lacus, quis auctor
        nisi velit in erat. Aenean ut consequat turpis.
      </p>
      <p>
        Praesent rhoncus purus et ultricies lobortis. Suspendisse pretium mi non
        erat blandit, vel elementum eros feugiat. Fusce hendrerit tempus tellus
        id condimentum. Praesent interdum erat mi, vel posuere augue iaculis
        nec. Fusce vitae nisi dapibus, volutpat mi eu, fringilla eros. Fusce
        iaculis, magna eu congue dapibus, massa massa lacinia orci, eu iaculis
        lacus risus a ex. Aenean a efficitur justo, eu tristique lorem. Fusce
        consectetur tempor arcu quis ultricies. Vestibulum et dui luctus,
        tincidunt dui ut, bibendum ante.
      </p>
    </div>
  );
};
