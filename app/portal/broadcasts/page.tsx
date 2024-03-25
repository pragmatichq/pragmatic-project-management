"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, ListFilter, Heart } from "lucide-react";

export default function BroadcastListing() {
  return (
    <section className="my-8 flex flex-col space-y-4">
      <h2 className="text-4xl font-bold tracking-tight">Broadcasts</h2>
      <p className="text-sm">Updates from the marketing department.</p>
      <div>
        <div className="flex gap-4 justify-between">
          <div className="relative w-full max-w-[400px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 size-4" />
            <Input
              placeholder="Search entries..."
              className="pl-10 pr-3 py-2 text-md w-full"
            />
          </div>
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
        <Separator className="my-8" />
        <div className="flex gap-4 flex-row">
          <div className="w-[200px]">
            <h2 className="text-sm mt-0.5">March 20, 2024</h2>
          </div>
          <div>
            <Badge variant="secondary">Release</Badge>
            <h2 className="text-2xl font-bold my-4">Big New Marketing News!</h2>
            <div className="prose">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vestibulum in elementum lectus. In metus nulla, efficitur vel
                convallis sit amet, pharetra non justo. Nullam neque nisl,
                fringilla nec mi id, pretium molestie tellus. Etiam elit odio,
                laoreet facilisis eros non, commodo sollicitudin mi. Fusce in
                euismod lectus. Mauris eget molestie nunc, eget dignissim ipsum.
                Fusce facilisis mauris ipsum, nec iaculis nulla ultricies a.
                Phasellus volutpat aliquet mi ut tincidunt.
              </p>
              <p>
                Maecenas ut porttitor justo. Etiam suscipit ligula ut lorem
                ornare, at elementum mi dignissim. Vestibulum ante ipsum primis
                in faucibus orci luctus et ultrices posuere cubilia curae;
                Praesent imperdiet massa non massa tristique volutpat.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia curae; Pellentesque congue eleifend diam, id
                vestibulum metus porttitor in. Aenean ac efficitur leo. Nullam
                mattis justo velit, quis porta neque placerat eget. Sed
                porttitor justo a urna ullamcorper blandit. Aliquam mattis
                lobortis mauris, at bibendum eros tincidunt nec. Morbi at eros
                sollicitudin, dapibus neque et, facilisis sapien. Quisque
                elementum justo ut tellus lobortis porttitor laoreet vitae nisi.
                Phasellus sagittis mattis risus, vel hendrerit erat posuere nec.
                Suspendisse fermentum justo ac justo tristique viverra.
                Phasellus dui tellus, rutrum ut turpis eu, blandit dignissim mi.
              </p>
              <p>
                Etiam cursus lacus nec dolor facilisis ullamcorper. Vestibulum
                auctor arcu velit, ac cursus massa scelerisque accumsan. Proin
                sollicitudin ut ante at euismod. Proin risus ipsum, gravida eu
                tortor at, lacinia porttitor libero. Fusce id eros lectus.
                Aenean pharetra elementum neque ac aliquet. Ut suscipit mattis
                massa at laoreet. Nam porta nulla sed felis porta, id sodales
                turpis laoreet. In hendrerit nibh sed eros fringilla, et
                eleifend est elementum. Donec ut purus vitae nulla euismod
                aliquet id eget elit. Donec at varius nulla. Nulla scelerisque
                posuere neque, non interdum diam tristique in. Integer ut
                lacinia orci. Sed euismod ex nibh, vel ultricies dui congue a.
                Curabitur ac mauris maximus, vulputate massa laoreet,
                consectetur augue. In eget interdum ipsum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
