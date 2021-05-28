import argparse
import pathlib
import http.server
import socket
import functools
import contextlib
import io

from jinja2 import Environment, FileSystemLoader

here = pathlib.Path(__file__).parent.absolute()
env = Environment(loader=FileSystemLoader(str(here)))


def context(component):
    context = dict(component=component)
    context["component_pascal"] = "".join(
        [w.capitalize() for w in component.split("-")]
    )
    return context


def dump(component):
    template = env.get_template("index.html.jinja")
    stream = template.stream(context(component))
    stream.dump(str(here / "index.html"))


def run(port, directory, bind):
    handler_class = functools.partial(
        http.server.SimpleHTTPRequestHandler, directory=directory
    )
    # ensure dual-stack is not disabled; ref #38907
    class DualStackServer(http.server.ThreadingHTTPServer):
        def server_bind(self):
            # suppress exception when protocol is IPv4
            with contextlib.suppress(Exception):
                self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
            return super().server_bind()

    print(f"Serving on: http://localhost:{port}")
    with contextlib.redirect_stdout(io.StringIO()) as f:
        http.server.test(
            HandlerClass=handler_class,
            ServerClass=DualStackServer,
            port=port,
            bind=bind,
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("component", help="component folder name")

    parser.add_argument(
        "--bind",
        "-b",
        metavar="ADDRESS",
        help="Specify alternate bind address " "[default: all interfaces]",
    )
    parser.add_argument(
        "--directory",
        "-d",
        default=str(here),
        help="Specify alternative directory " "[default:current directory]",
    )
    parser.add_argument(
        "--port",
        "-p",
        action="store",
        default=8000,
        type=int,
        help="Specify alternate port [default: 8000]",
    )
    args = parser.parse_args()

    dump(args.component)

    run(args.port, args.directory, args.bind)
