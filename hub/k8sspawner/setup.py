from setuptools import setup, find_packages
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

setup(
    name="k8sspawner",

    # Versions should comply with PEP440.  For a discussion on single-sourcing
    # the version across setup.py and the project code, see
    # https://packaging.python.org/en/latest/single_source_version.html
    version="0.0.1",

    description="K8s spawner for jupyterhub",
    long_description="K8s spawner for jupyterhub",

    # The projects main homepage.
    url="http://gitlab-dev.bgddi.com/root/ido-azure-infrastructure",

    # Author details
    author="",
    author_email="",

    # Choose your license
    license="",

    classifiers=[
        "Development Status :: 3 - Alpha",

        # Indicate who your project is intended for
        "Intended Audience :: Developers",

        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.3",
        "Programming Language :: Python :: 3.4",
        "Programming Language :: Python :: 3.5",
    ],

    keywords="jupyterhub spawner k8",
    py_modules=["k8sspawner"],

    install_requires=["jupyterhub", "jupyterhub-kubespawner", "async_generator"],

    extras_require={
    },

    package_data={
    },

    # To provide executable scripts, use entry points in preference to the
    # "scripts" keyword. Entry points provide cross-platform support and allow
    # pip to create the appropriate form of executable for the target platform.
    entry_points={
    },
)
